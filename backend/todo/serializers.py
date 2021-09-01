from rest_framework import serializers
from .models import Todo, Edges


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'title', 'description', 'completed', 'priority', 'x', 'y')


class EdgesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edges
        fields = ('id', 'source', 'target')
