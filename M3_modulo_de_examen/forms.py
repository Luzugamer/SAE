from django import forms
from .models import Examen, Pregunta, Opcion, ExamenPregunta

class ExamenForm(forms.ModelForm):
    class Meta:
        model = Examen
        fields = ['titulo', 'descripcion', 'duracion', 'tipo_examen']
        widgets = {
            'descripcion': forms.Textarea(attrs={'rows': 3}),
        }

class PreguntaForm(forms.ModelForm):
    class Meta:
        model = Pregunta
        fields = ['enunciado', 'tipo_pregunta', 'nivel_dificultad', 'respuesta_correcta', 'explicacion']
        widgets = {
            'enunciado': forms.Textarea(attrs={'rows': 3, 'class': 'form-control'}),
            'explicacion': forms.Textarea(attrs={'rows': 2, 'class': 'form-control'}),
            'respuesta_correcta': forms.TextInput(attrs={'class': 'form-control'}),
            'tipo_pregunta': forms.Select(attrs={'class': 'form-control', 'id': 'id_tipo_pregunta'}),
            'nivel_dificultad': forms.Select(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Hacer que respuesta_correcta no sea requerida inicialmente
        self.fields['respuesta_correcta'].required = False

    def clean(self):
        cleaned_data = super().clean()
        tipo_pregunta = cleaned_data.get('tipo_pregunta')
        respuesta_correcta = cleaned_data.get('respuesta_correcta')

        # Solo validar respuesta_correcta para tipos que no sean opción múltiple
        if tipo_pregunta in ['verdadero_falso', 'respuesta_corta']:
            if not respuesta_correcta:
                raise forms.ValidationError({
                    'respuesta_correcta': 'La respuesta correcta es obligatoria para este tipo de pregunta.'
                })

        return cleaned_data

class OpcionForm(forms.ModelForm):
    class Meta:
        model = Opcion
        fields = ['texto_opcion', 'es_correcta']
        widgets = {
            'texto_opcion': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Escriba la opción'}),
            'es_correcta': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

OpcionFormSet = forms.inlineformset_factory(
    Pregunta, Opcion, form=OpcionForm, extra=4, max_num=5, can_delete=False
)

class ResponderExamenForm(forms.Form):
    def __init__(self, examen, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        for pregunta in examen.examenpregunta_set.all().order_by('orden'):
            field_name = f'pregunta_{pregunta.id}'
            
            if pregunta.pregunta.tipo_pregunta == 'opcion_multiple':
                opciones = pregunta.pregunta.opciones.all()
                choices = [(op.id, op.texto_opcion) for op in opciones]
                self.fields[field_name] = forms.ChoiceField(
                    label=pregunta.pregunta.enunciado,
                    choices=choices,
                    widget=forms.RadioSelect
                )
            elif pregunta.pregunta.tipo_pregunta == 'verdadero_falso':
                self.fields[field_name] = forms.ChoiceField(
                    label=pregunta.pregunta.enunciado,
                    choices=[('True', 'Verdadero'), ('False', 'Falso')],
                    widget=forms.RadioSelect
                )
            else:
                self.fields[field_name] = forms.CharField(
                    label=pregunta.pregunta.enunciado,
                    widget=forms.TextInput
                )