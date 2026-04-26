import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    // Leemos exclusivamente desde las variables de entorno en frontend/.env
    const validUser = process.env.DASHBOARD_USER;
    const validPass = process.env.DASHBOARD_PASS;

    if (user === validUser && pwd === validPass) {
      return NextResponse.next()
    }
  }

  // Si no está autorizado o no hay cabecera, pide credenciales
  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Acceso Seguro Wamasivos"'
    }
  })
}

// Protegemos todas las rutas excepto el API (ya que tiene su propio control) 
// y los archivos estáticos o de next
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
