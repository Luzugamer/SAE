from django.urls import path
from . import views
from Login.views import logout_

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('registro/', views.registro_view, name='registro'),
    path('logout/', logout_, name='logout'),
]
