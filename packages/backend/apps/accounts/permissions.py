from apps.accounts.constants import UserRole


def is_super_admin(user):
    return user.is_authenticated and user.role == UserRole.SUPER_ADMIN


def is_school_admin(user):
    return user.is_authenticated and user.role == UserRole.SCHOOL_ADMIN


def is_teacher(user):
    return user.is_authenticated and user.role == UserRole.TEACHER


def is_student(user):
    return user.is_authenticated and user.role == UserRole.STUDENT


def is_parent(user):
    return user.is_authenticated and user.role == UserRole.PARENT
