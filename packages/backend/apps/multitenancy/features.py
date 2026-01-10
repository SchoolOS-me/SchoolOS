def is_feature_enabled(tenant, feature_name: str) -> bool:
    return bool(tenant.features.get(feature_name, False))