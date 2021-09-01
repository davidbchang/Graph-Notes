from django.shortcuts import render
from .serializers import TodoSerializer, EdgesSerializer
from rest_framework import viewsets
from .models import Todo, Edges


class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()


class EdgesView(viewsets.ModelViewSet):
    serializer_class = EdgesSerializer
    queryset = Edges.objects.all()
