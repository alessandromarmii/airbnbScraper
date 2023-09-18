from datetime import *
from selenium import webdriver
from selenium.webdriver.common.by import By
import numpy as np

def getPrices(links, startDate, endDate, num_guests):
    """
    links is an array of links!!!!
    startDate, endDate are in format: YYYY-MM-DDThh:mm:03.440Z
    """
    # links will contain empty links: we remove them
    valid_links =  [link for link in links if link]

    start = datetime.strptime(startDate[0:10], '%Y-%m-%d')  # datetime instance
    end = datetime.strptime(endDate[0:10], '%Y-%m-%d')

    curr = start

    ret = ""
    while curr <= end:
        costs = []
        for link in links:
            if link:
                costs.append(get_price_for_date(link, num_guests, curr))
                
                
        
        ret += "On date: " + str(curr)[:10] + " the avg cost is: " + str(np.mean(costs)) + " the max is " + str(max(costs)) + " and the min is " + str(min(costs)) + "\n"
        curr += timedelta(days=1)

    # we now print avg, max, min cost by day of the given links
    return ret






def modify_url(link, guests, checkin_date, checkout_date):
    # Find the position of 'adults=' in the URL
    adults_pos = link.find('adults=')

    if adults_pos != -1:
        # Find the position of the next '&' after 'adults='
        next_ampersand_pos = link.find('&', adults_pos)

        if next_ampersand_pos != -1:
            # Replace 'adults=' with 'adults=<guests>' in the URL
            link = link[:adults_pos] + f'adults={guests}' + link[next_ampersand_pos:]

    # Find the position of 'check_in=' in the URL
    checkin_pos = link.find('check_in=')

    if checkin_pos != -1:
        # Find the position of the next '&' after 'check_in='
        next_ampersand_pos = link.find('&', checkin_pos)

        if next_ampersand_pos != -1:
            # Replace 'check_in=<date>' with 'check_in=<new_checkin_date>' in the URL
            link = link[:checkin_pos] + f'check_in={checkin_date}' + link[next_ampersand_pos:]

    # Find the position of 'check_out=' in the URL
    checkout_pos = link.find('check_out=')

    if checkout_pos != -1:
        # Find the position of the next '&' after 'check_out='
        next_ampersand_pos = link.find('&', checkout_pos)

        if next_ampersand_pos != -1:
            # Replace 'check_out=<date>' with 'check_out=<new_checkout_date>' in the URL
            link = link[:checkout_pos] + f'check_out={checkout_date}' + link[next_ampersand_pos:]

    return link


def get_price(url):
    # Create a WebDriver instance (e.g., for Chrome)
    driver = webdriver.Chrome()
    driver.implicitly_wait(10)
    # Navigate to the URL
    driver.get(url)

    # Use Selenium to find the element by its XPath or CSS selector
    try:
        element = driver.find_element(By.CSS_SELECTOR, '#site-content > div > div:nth-child(1) > div:nth-child(3) > div > div._1s21a6e2 > div > div > div:nth-child(1) > div > div > div > div > div > div > div > div._wgmchy > div._1k1ce2w > div:nth-child(1) > div > span > div > span._tyxjp1')
        text = element.text
        return text
    except Exception as e:
        print(f"Element not found: {e}")
    # Close the browser when done
    driver.quit()


def get_price_for_date(link, guests, date):
    
    day_after = date + timedelta(days=1)
    # Modify the URL for the current check-in and checkout dates
    modified_url = modify_url(link, guests, date.strftime('%Y-%m-%d'), day_after.strftime('%Y-%m-%d'))

    return get_price(modified_url)
