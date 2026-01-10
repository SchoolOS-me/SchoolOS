from django.contrib import admin
from .models import User
from .constants import UserRole


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "role", "school", "is_active")
    list_filter = ("role", "is_active")
    search_fields = ("email",)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)

        if obj and obj.role == UserRole.SUPER_ADMIN:
            form.base_fields["school"].disabled = True

        return form

