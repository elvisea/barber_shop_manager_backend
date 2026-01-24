import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        if (key === 'NODE_ENV') {
          return 'test';
        }
        return defaultValue;
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a greeting message', () => {
      const result = appController.getHello();

      expect(result).toContain('💈 Barber Shop Manager API 💈');
      expect(result).toContain('✅ Status: Online');
      expect(result).toContain('🌎 Environment: test');
      expect(result).toContain('📚 Docs: /api (Swagger) | /api/docs (Redoc)');
    });
  });
});
