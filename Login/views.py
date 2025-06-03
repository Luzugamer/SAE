from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import UsuarioRegistroForm, UsuarioLoginForm
from .models import Rol, UsuarioRol
from django.utils import timezone

def registro_view(request):
    if request.method == 'POST':
        form = UsuarioRegistroForm(request.POST)
        if form.is_valid():
            try:
                user = form.save(commit=False)
                user.set_password(form.cleaned_data['password'])
                user.save()

                rol_nombre = form.cleaned_data['rol']
                rol_seleccionado = Rol.objects.get(nombre_rol=rol_nombre)
                UsuarioRol.objects.create(usuario=user, rol=rol_seleccionado)

                return redirect('login')
            
            except Rol.DoesNotExist:
                form.add_error('rol', 'El rol seleccionado no existe. Por favor seleccione un rol válido.')
                if user.pk:
                    user.delete()
    else:
        form = UsuarioRegistroForm()
    return render(request, 'Login/registro.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = UsuarioLoginForm(request.POST)
        if form.is_valid():
            correo = form.cleaned_data['correo_electronico']
            password = form.cleaned_data['password']
            rol_ingresado = form.cleaned_data['rol']

            user = authenticate(request, correo_electronico=correo, password=password)

            if user is not None:
                roles = user.usuariorol_set.values_list('rol__nombre_rol', flat=True)

                if rol_ingresado in roles:
                    user.ultima_sesion = timezone.now()  # REGISTRO DE INICIO
                    user.save()
                    login(request, user)

                    if rol_ingresado == 'profesor':
                        return redirect('pag_profe')
                    elif rol_ingresado == 'estudiante':
                        return redirect('pag_estu')
                else:
                    form.add_error('rol', 'El rol seleccionado no corresponde con el usuario.')
            else:
                form.add_error(None, 'Correo electrónico o contraseña inválidos.')
    else:
        form = UsuarioLoginForm()

    return render(request, 'Login/login.html', {'form': form})

def logout_(request):
    if request.user.is_authenticated:
        request.user.cierre_sesion = timezone.now()  # REGISTRO DE CIERRE
        request.user.save()
    logout(request)
    return redirect('descripcion')
