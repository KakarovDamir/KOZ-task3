from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
from bs4 import BeautifulSoup
from pymongo import MongoClient
from urllib.parse import quote_plus
from dotenv import load_dotenv
import os

load_dotenv()

db_name = "DemoDay"  
collection_name = "reviews" 
url = os.getenv("MONGODB_URL")

mongo_client = MongoClient(url)
db = mongo_client[db_name]
collection = db[collection_name]

options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(options=options)

restaurant_name = "I'm ресторан"
search_url = f"https://2gis.kz/almaty/search/{restaurant_name}"

def get_restaurant_links():
    """Собирает ссылки на рестораны со страницы поиска"""
    driver.get(search_url)
    time.sleep(5)

    for _ in range(5):
        driver.find_element(By.TAG_NAME, "body").send_keys(Keys.PAGE_DOWN)
        time.sleep(1)

    soup = BeautifulSoup(driver.page_source, "html.parser")
    links = []
    results = soup.find_all("a", class_="_1rehek")
    for result in results:
        link = result.get("href")
        if link:
            links.append(f"https://2gis.kz{link}")
    return links

def parse_reviews(restaurant_url, max_reviews=50):
    """Парсит отзывы с конкретного ресторана"""
    driver.get(restaurant_url)
    time.sleep(5)

    try:
        reviews_button = driver.find_element(By.XPATH, "//a[contains(@href, 'tab/reviews')]")
        reviews_button.click()
        time.sleep(5)
    except Exception as e:
        print(f"Не удалось найти или нажать на кнопку 'Отзывы' для {restaurant_url}: {e}")
        return []

    for _ in range(10):  
        driver.find_element(By.TAG_NAME, "body").send_keys(Keys.PAGE_DOWN)
        time.sleep(1)

    soup = BeautifulSoup(driver.page_source, "html.parser")
    reviews = []
    review_elements = soup.find_all("div", class_="_1k5soqfl")
    
    for review in review_elements[:max_reviews]:
        try:
            text = review.find("div", class_="_49x36f").get_text(strip=True)
            reviews.append({
                "text": text
            })
        except AttributeError:
            continue  
    return reviews

try:
    restaurant_links = get_restaurant_links()
    print(f"Найдено ресторанов: {len(restaurant_links)}")
    
    for idx, link in enumerate(restaurant_links, start=1):
        print(f"Парсим ресторан {idx}: {link}")
        reviews = parse_reviews(link, max_reviews=50)
        
        restaurant_data = {
            "restaurant_url": link,
            "reviews": reviews
        }
        collection.insert_one(restaurant_data)
        
        print(f"Сохранено {len(reviews)} отзывов для ресторана: {link}")
        
finally:
    driver.quit()
    mongo_client.close()
