import firebase_admin
from firebase_admin import credentials, storage

# Ruta al archivo JSON de credenciales descargado desde Firebase
cred = credentials.Certificate('firebase/fashionstore-fd2e1-firebase-adminsdk-fbsvc-b0a7383002.json')

# Inicializar la app de Firebase
firebase_admin.initialize_app(cred, {
    'storageBucket': 'fashionstore-fd2e1.firebasestorage.app'
})

# Función para obtener el bucket de Firebase
def get_bucket():
    return storage.bucket()