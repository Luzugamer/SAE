from django.urls import path
from .views import *

urlpatterns = [
    path('', pag_descripcion, name='descripcion'),
    path('principal/', pag_principal, name='principal'),
    path('repositorio/', repositorio, name='repositorio'),

    path('estudiante/', pag_estu, name='pag_estu'),
    path('profesor/', pag_profe, name='pag_profe'),
]