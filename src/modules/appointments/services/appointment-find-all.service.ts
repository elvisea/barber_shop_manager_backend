import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppointmentFindAllService {
  private readonly logger: Logger = new Logger(AppointmentFindAllService.name);
}
