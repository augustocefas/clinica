import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TenancyModule } from 'src/tenancy/tenancy.module';
import { PacientesModule } from 'src/pacientes/pacientes.module';
import { ProfissionaisModule } from 'src/profissionais/profissionais.module';
import { ExamesModule } from 'src/exames/exames.module';
import { SetoresModule } from 'src/setores/setores.module';
import { PlanosModule } from 'src/planos/planos.module';
import { AgendaModule } from 'src/agenda/agenda.module';
import { UsersModule } from 'src/users/users.module';
import { GrupoExameModule } from 'src/grupo-exame/grupo-exame.module';
import { SegmentoModule } from 'src/segmento/segmento.module';
import { ProcedimentosModule } from 'src/procedimentos/procedimentos.module';
import { StatusFinanceiroModule } from 'src/status-financeiro/status-financeiro.module';
import { FinanceiroModule } from 'src/financeiro/financeiro.module';
import { EventoFinanceiroModule } from 'src/evento-financeiro/evento-financeiro.module';
import { DominioModule } from 'src/dominio/dominio.module';
import { PacienteLogModule } from 'src/paciente-log/paciente-log.module';
import { SolicitacaoModule } from 'src/solicitacao/solicitacao.module';
import appConfig from './app.config';
import { AuthModule } from 'src/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 60,
        blockDuration: 5000,
      },
    ]),

    // Carrega variáveis de ambiente e torna o ConfigService global
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    // Usa ConfigService para configurar o TypeORM após carregar o .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: async ({ database }: ConfigType<typeof appConfig>) => ({
        type: database.type as any,
        host: database.host,
        port: database.port,
        username: database.username,
        database: database.database,
        password: database.password,
        autoLoadEntities: true,
        synchronize: database.synchronize,
      }),
    }),
    AuthModule,
    TenancyModule,
    PacientesModule,
    ProfissionaisModule,
    ExamesModule,
    SetoresModule,
    PlanosModule,
    AgendaModule,
    UsersModule,
    GrupoExameModule,
    SegmentoModule,
    ProcedimentosModule,
    StatusFinanceiroModule,
    FinanceiroModule,
    EventoFinanceiroModule,
    DominioModule,
    PacienteLogModule,
    SolicitacaoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
