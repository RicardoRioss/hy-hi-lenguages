import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'node:util';

// o promisify converte uma função que usa padrão async de callbacks, para Promises

// O AuthorizationGuard é um Middleware (Express)
// Ele vai determinar se o usuário pode proseguir com a requisição ou não
// Dentro do context temos basicamente o (request, response) do Express
// Basicamente ele verifica se dentro da resquest esta vindo o token JWT,
//se o token é válido( Vai determinar se o usuário tem acesso ou não a rota que ele esta querendo acessar )
@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;

  constructor(private consfigService: ConfigService) {
    this.AUTH0_AUDIENCE = this.consfigService.get('AUTH0_AUDIENCE') ?? '';
    this.AUTH0_DOMAIN = this.consfigService.get('AUTH0_DOMAIN') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const httpContext = context.switchToHttp();
    // const req = httpContext.getRequest();
    // const res = httpContext.getResponse();

    const { req, res } = GqlExecutionContext.create(context).getContext(); //para pegar o req e o res no GraphQL

    const checkJWT = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        }),
        audience: this.AUTH0_AUDIENCE,
        issuer: this.AUTH0_DOMAIN,
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJWT(req, res);
      return true;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
