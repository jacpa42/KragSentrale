from datetime import datetime

from smtplib import SMTP
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from googleapiclient.discovery import json

# This is defined on the wallet and pay console. It is a constant identifier for the pass.
# If we add more passes (ie an event pass or the like) we need to create a new class_suffix.
MEMBER_PASS_CLASS_SUFFIX = "krag-sentrale-pass"


def construct_email_body(
    html_body: str, member_data: dict, krag_email_credentials: dict
) -> MIMEMultipart:
    """Constructs an email given a body.

    Args:
        html_body (str): The body of the email formatted as valid html
        member_data (dict): The data associated with the target user
        krag_email_credentials (dict): The organisation data

    Returns:
        The MIMEMultipart message for an smtp server
    """
    message = MIMEMultipart("alternative")
    message["Subject"] = "Kragsentrale Membership Pass"
    message["From"] = krag_email_credentials["email"]
    message["To"] = member_data["email"]
    message.attach(MIMEText(html_body, "html"))
    return message


def send_email(html_body: str, member_data: dict) -> bool:
    """Send an email to a member

    Args:
        html_body (str): The body of the email formatted as valid html
        member_data (dict): The data associated with the target user

    Returns:
        Boolean: Whether the send was successful
    """
    krag_email_credentials = json.load(open("./credentials/gmail_smtp.json"))
    message = construct_email_body(html_body, member_data, krag_email_credentials)
    try:
        server = SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.login(krag_email_credentials["email"], krag_email_credentials["key"])
        print(f"Logged into {krag_email_credentials["email"]} at {datetime.now()}")
        server.sendmail(
            krag_email_credentials["email"],
            member_data["email"],
            message.as_string(),
        )
        server.quit()
        print(f'Send success : {member_data["email"]}')
        return True
    except Exception as e:
        print(f"Email send failure to {member_data["email"]} at [{datetime.now()}]")
        print(e)
        return False
