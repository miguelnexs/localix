from django import forms
from .models import Cliente, ImagenProducto

class ClienteForm(forms.ModelForm):
    class Meta:
        model = Cliente
        fields = '__all__'