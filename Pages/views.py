from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from Login.decorators import rol_requerido


def pag_principal(request):
    return render(request, 'Pages/pag_principal.html')

@login_required
@rol_requerido('estudiante')
def pag_estu(request):
    return render(request, 'Pages/pag_estu.html')

@login_required
@rol_requerido('profesor')
def pag_profe(request):
    return render(request, 'Pages/pag_profe.html')