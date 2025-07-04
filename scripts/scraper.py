from bs4 import BeautifulSoup
import requests
import re
import json
import time
import os

# Streamlit removed - not needed for automation scripts

HEADERS = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Referer": "https://google.com",
            "Connection": "keep-alive",
        }
PREFIX = "https://www.examtopics.com/discussions/"

def load_json(json_path):
    if not os.path.exists(json_path):
        return {}
    with open(json_path, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}
        
def save_json(file, json_path):
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(file, f, ensure_ascii=False, indent=2)

def get_exam_category(exam_code):
    response = requests.get(f"https://www.examtopics.com/search/?query={exam_code}", allow_redirects=True)
    final_url = response.url
    if "/exams/" in final_url:
        parts = final_url.strip("/").split("/")
        if len(parts) >= 2:
            return parts[-2]  # category is second-to-last
        return None

    soup = BeautifulSoup(response.content, "html.parser")
    exam_list = soup.find_all("ul", class_="exam-list-font")
    if len(exam_list) < 1:
        return None

    for exam in exam_list:
        for a in exam.find_all("a", href=True):
            if a.text.strip().startswith(exam_code):
                href = a['href']
                # Split the path and get the second-to-last segment
                parts = href.strip("/").split("/")
                if len(parts) >= 2:
                    return parts[-2]
    
    return None

def get_question_links(exam_code, progress, json_path, force_rescan=False):
    progress.progress(0, text=f"Starting link extraction...")
    category = get_exam_category(exam_code)

    if not category:
        raise ValueError(f"Exam code {exam_code} not found.")

    url = f"{PREFIX}{category}/"
    # Get the first page to find number of pages
    response = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(response.content, "html.parser")

    # Find number of pages
    page_indicator = soup.find("span", class_="discussion-list-page-indicator")
    if not page_indicator:
        raise ValueError("Page indicator not found. Page structure may have changed.")
    strong_tags = page_indicator.find_all("strong")
    num_pages = int(strong_tags[1].text)

    links_json = load_json(json_path)
    if links_json and not force_rescan:
        question_links = links_json.get("links", [])
        page_num = links_json.get("page_num", 1)
        status = links_json.get("status", "in progress")
        if status == "complete":
            progress.progress(1, text=f"Links extracted from file")
            return question_links
    else:
        question_links = []
        page_num = 1
        status = "in progress"

    # If force_rescan is True, start fresh
    if force_rescan:
        question_links = []
        page_num = 1
        status = "in progress"
        progress.progress(0, text=f"Force rescanning links...")

    # Loop through all pages
    for i in range(page_num, num_pages + 1):
        progress.progress((i) / num_pages, text=f"Extracting question links - page {i} of {num_pages}...")
        page_url = url + f"{i}/"

        page_response = requests.get(page_url, headers=HEADERS)
        soup = BeautifulSoup(page_response.content, "html.parser")
        titles = soup.find_all("div", class_="dicussion-title-container")
        for title in titles:
            if title.text:
                title_text = title.text.strip()
                if f"Exam {exam_code}" in title_text:
                    a_tag = title.find("a")
                    if a_tag and "href" in a_tag.attrs:
                        question_links.append(a_tag["href"])
    sorted_links = sorted(question_links, key=lambda link: int(re.search(r'question-(\d+)', link).group(1)))
    question_links_obj = {"page_num": i, "status": "complete", "links": sorted_links}
    save_json(question_links_obj, json_path)
    return sorted_links

def scrape_page(link):
    question_object = {}

    try:
        response = requests.get(link, headers=HEADERS)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
    except Exception as e:
        return {
            "question": "",
            "answers": [],
            "comments": [],
            "most_voted": None,
            "link": link,
            "question_number": "unknown",
            "error": f"Request or parsing failed: {e}"
        }

    question_number_match = re.search(r"question-(\d+)", link)
    question_number = question_number_match.group(1) if question_number_match else "unknown"

    # Extract question
    question = ""
    try:
        question_div = soup.find("div", class_="question-body")
        question_content = question_div.find("p", class_="card-text") if question_div else None
        if question_content:
            question = question_content.decode_contents().strip()
    except Exception:
        pass

    # Extract most voted answers
    most_voted = None
    try:
        voted_answers = soup.find("div", class_="voted-answers-tally")
        if voted_answers:
            script_content = voted_answers.find("script")
            if script_content and script_content.string:
                voted_json = json.loads(script_content.string)
                most_voted_object = next((item for item in voted_json if item.get('is_most_voted')), None)
                if most_voted_object:
                    most_voted = most_voted_object.get("voted_answers", None)
    except Exception:
        pass

    # Extract answer options
    answers = []
    try:
        if question_div:
            answers_div = question_div.find("div", class_="question-choices-container")
            if answers_div:
                answer_options = answers_div.find_all("li")
                if answer_options:
                    answers = [re.sub(r'\s+', ' ', answer_option.text).strip() for answer_option in answer_options]
    except Exception:
        pass

    # Extract comments and replies
    comments = []
    try:
        discussion_div = soup.find("div", class_="discussion-container")
        comment_divs = discussion_div.find_all("div", class_="comment-container", recursive=False) if discussion_div else []
        for comment_div in comment_divs:
            comment = {}
            try:
                comment_content_div = comment_div.find("div", class_="comment-content")
                comment_content = comment_content_div.text.strip() if comment_content_div else ""
            except Exception:
                comment_content = ""

            try:
                comment_selected_answer = comment_div.find("div", class_="comment-selected-answers")
                selected_answer = comment_selected_answer.find("span").text.strip() if comment_selected_answer else ""
            except Exception:
                selected_answer = ""

            replies = []
            try:
                comment_replies_div = comment_div.find("div", class_="comment-replies")
                if comment_replies_div:
                    reply_divs = comment_replies_div.find_all("div", class_="comment-container")
                    for reply in reply_divs:
                        try:
                            reply_content = reply.find("div", class_="comment-content").text.strip()
                        except Exception:
                            reply_content = ""
                        replies.append(reply_content)
            except Exception:
                pass

            comment["content"] = comment_content
            comment["selected_answer"] = selected_answer
            comment["replies"] = replies

            comments.append(comment)
    except Exception:
        pass

    question_object["question"] = question
    question_object["answers"] = answers
    question_object["comments"] = comments
    question_object["question_number"] = question_number
    question_object["link"] = link
    question_object["most_voted"] = most_voted
    question_object["error"] = None

    return question_object

        
def scrape_questions(question_links, json_path, progress, rapid_scraping=False):
    questions_obj = load_json(json_path)
    if questions_obj:
        questions = questions_obj.get("questions", [])
    else:
        questions = []
    prefix = "https://www.examtopics.com"
    questions_num = len(question_links)
    error_string = ""
    for i, link in enumerate(question_links):
        question_number_match = re.search(r"question-(\d+)", link)
        question_number = question_number_match.group(1) if question_number_match else "unknown"
        if question_number in [q["question_number"] for q in questions]:
            progress.progress((i+1)/(questions_num), text=f"{i+1}/{questions_num} - Skipping {prefix+link}")
            continue
        progress.progress((i+1)/(questions_num), text=f"{i+1}/{questions_num} - Scraping {prefix+link}")
        question_object = scrape_page(prefix+link)
        if question_object["error"]:
            error_string = (f"Error: {question_object['error']}")
            break
        questions.append(question_object)
        if not rapid_scraping:
            time.sleep(5)
    questions.sort(key=lambda x: int(x["question_number"]) if x["question_number"].isdigit() else float('inf'))
    status = "complete" if len(questions) == questions_num else "in progress"
    questions_obj = {"status": status, "error": error_string, "questions": questions}
    save_json(questions_obj, json_path)
    return questions_obj
    

def load_json_from_github(exam_code):
    url = f"https://raw.githubusercontent.com/17Andri17/ExamTopics-Question-Viewer/refs/heads/main/data/{exam_code}.json"
    try:
        response = requests.get(url)
        response.raise_for_status()
        questions_obj = json.loads(response.text)
        questions = questions_obj.get("questions", [])
        return questions, ""
    except requests.RequestException as e:
        return [], f"Failed to load file from GitHub for exam {exam_code}. It probably does not exist."


def get_current_links_count(exam_code, timeout=10):
    """
    Gets the current number of available links without modifying files
    Uses a quick estimation method to avoid long delays
    """
    try:
        category = get_exam_category(exam_code)
        if not category:
            return 0
        
        url = f"{PREFIX}{category}/"
        response = requests.get(url, headers=HEADERS, timeout=timeout)
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Find number of pages
        page_indicator = soup.find("span", class_="discussion-list-page-indicator")
        if not page_indicator:
            return 0
        
        strong_tags = page_indicator.find_all("strong")
        if len(strong_tags) < 2:
            return 0
        
        num_pages = int(strong_tags[1].text)
        
        # Quick estimation: only check first few pages to estimate total
        # This is much faster than checking all pages
        sample_pages = min(3, num_pages)  # Check max 3 pages for estimation
        total_links = 0
        
        for i in range(1, sample_pages + 1):
            page_url = url + f"{i}/"
            page_response = requests.get(page_url, headers=HEADERS, timeout=timeout)
            soup = BeautifulSoup(page_response.content, "html.parser")
            titles = soup.find_all("div", class_="dicussion-title-container")
            
            page_links = 0
            for title in titles:
                if title.text and f"Exam {exam_code}" in title.text.strip():
                    page_links += 1
            total_links += page_links
        
        # Estimate total based on sample
        if sample_pages < num_pages:
            avg_per_page = total_links / sample_pages if sample_pages > 0 else 0
            estimated_total = int(avg_per_page * num_pages)
            return estimated_total
        
        return total_links
    except Exception:
        return 0


def check_for_updates(exam_code, progress, skip_online_check=False):
    """
    Checks if exam files need to be updated by comparing 
    existing links with newly available links
    """
    questions_path = f"data/{exam_code}.json"
    links_path = f"data/{exam_code}_links.json"
    
    # Check if files exist
    questions_exist = os.path.exists(questions_path)
    links_exist = os.path.exists(links_path)
    
    # If no files exist, update needed
    if not questions_exist and not links_exist:
        return True, "Exam files not found"
    
    # If questions file doesn't exist but links exist
    if not questions_exist:
        return True, "Questions file missing"
    
    # Load existing questions
    questions_json = load_json(questions_path)
    if not questions_json:
        return True, "Questions file corrupted or empty"
    
    # Check if status is "complete"
    if questions_json.get("status") != "complete":
        return True, "Previous scraping incomplete"
    
    # Skip online check if requested (for faster loading)
    if skip_online_check:
        return False, "Files exist and complete (online check skipped)"
    
    # Get current number of available links with timeout
    progress.progress(15, text="Checking for new questions...")
    try:
        current_links_count = get_current_links_count(exam_code, timeout=5)
    except Exception:
        # If network check fails, assume files are up to date
        return False, "Network check failed, assuming files are up to date"
    
    if current_links_count == 0:
        # Unable to check, assume files are up to date
        return False, "Unable to check for updates"
    
    existing_questions = questions_json.get("questions", [])
    existing_count = len(existing_questions)
    
    # If there are more links available than existing questions
    if current_links_count > existing_count:
        return True, f"New questions detected: {current_links_count - existing_count} missing questions"
    
    return False, "Files up to date"


def update_exam_data(exam_code, progress, rapid_scraping=False, force_rescan=False):
    """
    Updates exam data by scraping new questions
    """
    questions_path = f"data/{exam_code}.json"
    links_path = f"data/{exam_code}_links.json"
    
    try:
        # Get all question links
        links = get_question_links(exam_code, progress, links_path, force_rescan)
        
        if len(links) == 0:
            return [], "No questions found. Please check the exam code and try again."
        
        # Scrape questions
        questions_obj = scrape_questions(links, questions_path, progress, rapid_scraping)
        questions = questions_obj.get("questions", [])
        
        if questions_obj.get("error", "") != "":
            return (questions, f"Error occurred while scraping questions. Your connection may be slow or the website may have limited your rate. You can still see {len(questions)} questions. Try again later by refreshing the page.")
        
        return (questions, "")
        
    except Exception as e:
        return [], str(e)