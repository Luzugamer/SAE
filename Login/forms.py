from django import forms
from .models import Usuario
import re

class UsuarioLoginForm(forms.Form):
    correo_electronico = forms.EmailField(label="Correo electrónico")
    password = forms.CharField(label="Contraseña", widget=forms.PasswordInput)

class UsuarioRegistroForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    password_confirm = forms.CharField(label="Confirmar contraseña", widget=forms.PasswordInput)

    class Meta:
        model = Usuario
        fields = ['nombre', 'apellido', 'correo_electronico', 'password', 'password_confirm']

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
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')

        if password and password_confirm and password != password_confirm:
            raise forms.ValidationError('Las contraseñas no coinciden.')

        return cleaned_data