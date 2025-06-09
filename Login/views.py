from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.cache import never_cache
from .forms import UsuarioRegistroForm, UsuarioLoginForm
from .models import UsuarioRol, Usuario
from django.utils import timezone

def registro_view(request):
    if request.method == 'POST':
        form = UsuarioRegistroForm(request.POST)
        if form.is_valid():
            # Usar el manager personalizado que automáticamente asigna el rol de estudiante
            user = Usuario.objects.create_user(
                correo_electronico=form.cleaned_data['correo_electronico'],
                nombre=form.cleaned_data['nombre'],
                apellido=form.cleaned_data['apellido'],
                password=form.cleaned_data['password']
            )
            return redirect('login')
    else:
        form = UsuarioRegistroForm()
    return render(request, 'Login/registro.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = UsuarioLoginForm(request.POST)
        if form.is_valid():
            correo = form.cleaned_data['correo_electronico']
            password = form.cleaned_data['password']

            user = authenticate(request, correo_electronico=correo, password=password)

            if user is not None:
                # Obtener el rol del usuario
                try:
                    usuario_rol = UsuarioRol.objects.get(usuario=user)
                    rol_usuario = usuario_rol.rol.nombre_rol
                    
                    user.ultima_sesion = timezone.now()  # REGISTRO DE INICIO
                    user.save()
                    login(request, user)

                    # Redireccionar según el rol del usuario
                    if rol_usuario == 'admin':
                        return redirect('/admin/')  # Redirigir al panel de administración
                    elif rol_usuario == 'profesor':
                        return redirect('pag_profe')
                    elif rol_usuario == 'estudiante':
                        return redirect('pag_estu')
                    else:
                        # Para roles no reconocidos, redireccionar a una página por defecto
                        return redirect('pag_estu')
                        
                except UsuarioRol.DoesNotExist:
                    form.add_error(None, 'Usuario sin rol asignado. Contacte al administrador.')
            else:
                form.add_error(None, 'Correo electrónico o contraseña inválidos.')
    else:
        form = UsuarioLoginForm()

    return render(request, 'Login/login.html', {'form': form})

@never_cache
def logout_(request):
    if request.user.is_authenticated:
        request.user.cierre_sesion = timezone.now()
        request.user.save()
    logout(request)
    return redirect('descripcion')