from typing import Optional


def get_user_tenant(user) -> Optional[object]:
    """
    Returns the tenant associated with the user's school if available.
    Falls back to None when tenant data is not configured.
    """
    school = getattr(user, "school", None)
    if not school:
        return None
    return getattr(school, "tenant", None)


def filter_by_tenant(queryset, tenant):
    if tenant is None:
        return queryset
    return queryset.filter(tenant=tenant)
