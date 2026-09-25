from pwdlib import PasswordHash


def hash_password(password: str) -> str:
    ph = PasswordHash.recommended()
    return ph.hash(password)
