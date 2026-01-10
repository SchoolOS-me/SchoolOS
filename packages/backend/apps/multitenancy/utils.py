def scope_queryset_to_tenant(queryset, user):
    """
    Enforces tenant isolation at query level.
    SUPER_ADMIN sees everything.
    Others see only their tenant.
    """
    if user.is_superuser:
        return queryset

    return queryset.filter(tenant=user.school.tenant)
