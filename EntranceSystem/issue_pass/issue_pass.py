from envs import APP_PASSWORD, ISSUER_ID, CLASS_SUFFIX, KRAG_EMAIL
import smtplib
from email.mime.text import MIMEText

from create_pass_object import DemoGeneric


def get_object_link(obj_suffix: str) -> str:
    demo = DemoGeneric()
    demo.create_object(ISSUER_ID, CLASS_SUFFIX, obj_suffix)
    return demo.create_jwt_new_objects(ISSUER_ID, CLASS_SUFFIX, obj_suffix)


def email_link_to_recipient(recipient: str, obj_suffix: str):
    link = get_object_link(obj_suffix)
    body = f"""\
    <html>
    <head></head>
    <body>
        <p>Hi!<br>
        How are you?<br>
        Here is the <a href="{link}">link</a> you wanted.
        </p>
    </body>
    </html>
    """

    msg = MIMEText(body, "html")
    msg["Subject"] = "Google wallet pass link"
    msg["From"] = KRAG_EMAIL
    msg["To"] = recipient

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp_server:
        # smtp_server.login(KRAG_EMAIL, APP_PASSWORD)
        smtp_server.login(KRAG_EMAIL, APP_PASSWORD)
        smtp_server.sendmail(KRAG_EMAIL, recipient, msg.as_string())
    print("Email sent!")
