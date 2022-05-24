# Data-Warehouse

Herramienta que permite a una compañía de Marketing administrar todos los contactos de sus clientes para sus campañas.
Sitio web que permita realizar operaciones CRUD a una base de datos de contactos que incluyen sus datos personales, sus preferencias, datos de contacto, lugar donde trabajan, y lugar donde viven.

## Documentación

#### 1. Clonar repo

Para empezar abre la terminal, copia, pega y ejecuta la siguiente línea de código:

```
git clone https://github.com/daniel-beta/Data-Warehouse.git
```

#### 2. Instalar el proyecto

Entra a la raíz del proyecto en la terminal y ejecuta el siguiente comando:

```
npm i
```

#### 3. Crear tablas

En la raíz del proyecto encontrarás la carpeta **BE** y dentro de ella un archivo llamado `data_warehouse.sql`, con este podrás generar la base de datos. Puedes hacerlo con ayuda de **XAMPP** y **MySQL Workbench** para las configuraciones y conexiones del servidor.

![Captura de Pantalla 2021-12-30 a la(s) 10 22 30 p  m](https://user-images.githubusercontent.com/64673306/147801318-2c876ef8-c2b7-471b-8b60-cb1ca872789e.png)
![image](https://user-images.githubusercontent.com/64673306/149876026-bdb6cb7a-452c-4196-9e1d-3eb204f9d62a.png)

**NOTA:** Si no sabes como configurar las conexiones de tu servidor puedes basarte en los siguientes videos (según tu sistema operativo):

- [Mac](https://youtu.be/P2yS47MxjLM)
- [Windows](https://youtu.be/Wf-0PT7q6i4)

#### 4. Datos de entorno

Asegúrate de que el archivo `db.js` tenga guardados correctamente los datos de tu entorno.

#### 5. Inicia el proyecto (Backend)

Ejecuta la siguiente línea en tu terminal (Estando ubicado en la carpeta **BE**):

```
npm run start
```

Y verifica que el servidor se conecte validando el siguiente mensaje en tu terminal:

![image](https://user-images.githubusercontent.com/64673306/149877639-9ffa680a-a143-4c62-8876-6edc33f651ac.png)

#### 6. Mira la documentación de la API

Válida la documentación que se encuentra en el archivo `spec.yml`, copiala y pegala en **[Swagger](https://editor.swagger.io/)** para facilitar su visualización.

![image](https://user-images.githubusercontent.com/64673306/149879573-dacf3219-f956-4db1-ab5b-264156a28f6d.png)

#### 7. Postman

Podrás importar el archivo **`BE/Data-Warehouse.postman_collection.json`** como colección en **POSTMAN** y así probar allí cada uno de los endpoints.

![image](https://user-images.githubusercontent.com/64673306/149881033-7d53f41e-7a55-4ec2-b1e5-09d2d579427d.png)

#### 8. Inicia el Frontend

Ingresa a la carpeta **FE** en la raiz del proyecto y con ayuda de un **Live Server** abre el archivo `index.html` en tu local, de esta manera podrás interactuar con la herramienta.

![image](https://user-images.githubusercontent.com/64673306/149995999-8862ea99-65d9-4762-b1fc-cbf264841bf8.png)

Para iniciar sesión como **Admin** usa las siguientes credenciales:

```
Usuario: danielbetancur@ingenieros.com
Contraseña: 1234
```

![image](https://user-images.githubusercontent.com/64673306/149996386-14511e55-af55-435c-b28c-53836103bd24.png)
