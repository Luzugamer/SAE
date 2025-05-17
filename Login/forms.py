from django import forms
from .models import Usuario, Estudiante, Docente
import re

class UsuarioLoginForm(forms.Form):
    correo_electronico = forms.EmailField(label="Correo electrónico")
    password = forms.CharField(label="Contraseña", widget=forms.PasswordInput)
    
    ROL_CHOICES = (
        ('estudiante', 'Estudiante'),
        ('profesor', 'Profesor'),
    )
    rol = forms.ChoiceField(choices=ROL_CHOICES, widget=forms.RadioSelect(attrs={'class': 'horizontal-radio'}))


class UsuarioRegistroForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    password_confirm = forms.CharField(label="Confirmar contraseña", widget=forms.PasswordInput)

    ROL_CHOICES = (
        ('estudiante', 'Estudiante'),
        ('profesor', 'Profesor'),
    )
    rol = forms.ChoiceField(
        choices=ROL_CHOICES,
        widget=forms.RadioSelect(attrs={'class': 'horizontal-radio'})
    )

    class Meta:
        model = Usuario
        fields = ['nombre', 'apellido', 'correo_electronico', 'password', 'password_confirm', 'rol']


    def clean_password(self):
        password = self.cleaned_data.get('password')

        if len(password) < 8:
            raise forms.ValidationError('La contraseña debe tener al menos 8 caracteres.')
        if not re.search(r'[A-Z]', password):
            raise forms.ValidationError('Debe contener al menos una letra mayúscula.')
        if not re.search(r'[a-z]', password):
            raise forms.ValidationError('Debe contener al menos una letra minúscula.')
        if not re.search(r'[0-9]', password):
            raise forms.ValidationError('Debe contener al menos un número.')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise forms.ValidationError('Debe incluir al menos un símbolo o carácter especial.')

        return password

    def clean(self):
        cleaned_data = super().clean()
        return cleaned_data
    
class EstudianteForm(forms.ModelForm):
    class Meta: 
        model = Estudiante
        fields = ['nombre', 'correo', 'contraseña']

class DocenteFrom(forms.ModelForm):
    class Meta: 
        model = Docente
        fields = ['nombre', 'correo', 'contraseña']