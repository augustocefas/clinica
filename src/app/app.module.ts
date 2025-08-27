import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

@Module({
  imports: [
    // Carrega variáveis de ambiente e torna o ConfigService global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    // Usa ConfigService para configurar o TypeORM após carregar o .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USERNAME'),
        database: config.get<string>('DB_DATABASE'),
        password: config.get<string>('DB_PASSWORD'),
        autoLoadEntities: true,
        // Sincroniza com o BD. Não deve ser usado em produção
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
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
  providers: [AppService],
  exports: [],
})
export class AppModule {}
