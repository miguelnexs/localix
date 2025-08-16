#!/usr/bin/env python3
"""
Script de prueba simple para verificar el endpoint de categorías
"""
import requests

def test_category_endpoint():
    """Prueba básica del endpoint de categorías"""
    
    # URL del backend
    base_url = "http://localhost:8000"
    
    try:
        # Probar el endpoint de categorías sin autenticación
        print("Probando endpoint de categorías...")
        response = requests.get(f"{base_url}/api/categorias/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Probar el endpoint de health check
        print("\nProbando health check...")
        health_response = requests.get(f"{base_url}/health/")
        print(f"Health Status: {health_response.status_code}")
        print(f"Health Response: {health_response.text}")
        
        # Probar el endpoint de información de la API
        print("\nProbando info de API...")
        info_response = requests.get(f"{base_url}/")
        print(f"Info Status: {info_response.status_code}")
        print(f"Info Response: {info_response.text}")
        
    except Exception as e:
        print(f"Error en la prueba: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_category_endpoint()
