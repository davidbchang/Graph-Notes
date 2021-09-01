from django.contrib import admin
from .models import Todo, Edges


class TodoAdmin(admin.ModelAdmin):
    list = ('title', 'description', 'complete', 'priority')


admin.site.register(Todo, TodoAdmin)


class EdgesAdmin(admin.ModelAdmin):
    list = ('source', 'target')


admin.site.register(Edges, EdgesAdmin)
