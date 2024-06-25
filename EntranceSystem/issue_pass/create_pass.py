from pass_object import KragSentralePassIssuer
from googleapiclient.discovery import json, os


# This is defined on the wallet and pay console. It is a constant identifier for the pass.
# If we add more passes (ie an event pass or the like) we need to create a new class_suffix.
MEMBER_PASS_CLASS_SUFFIX = "krag-sentrale-pass"


def load_user_data(database_lookup_data: str) -> dict:
    # TODO: Add database integration. Currently (06/25/2024) this loads a demo json
    return json.load(open(os.path.join(os.getcwd(), "demo_user.json")))


def create_pass(
    issuer: KragSentralePassIssuer,
    member_data: dict,
) -> str:
    """Create a class.

    Args:
        issuer (KragSentralePassIssuer): The authorized issuer for passes.
        data (str): Developer-defined data for each user account in database.

    Returns:
        The pass class ID (str)
    """
    return issuer.create_object(MEMBER_PASS_CLASS_SUFFIX, member_data["pass_id"])
