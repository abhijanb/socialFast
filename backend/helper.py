from pwdlib import PasswordHash

_ph = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return _ph.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return _ph.verify(password, password_hash)
