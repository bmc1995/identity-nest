import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

/**
 * Body for `POST /interaction/:uid/consent`.
 *
 * The consent form posts `approved=true` to allow and `approved=false` to deny;
 * absence is treated as denial.
 */
export class ConsentDto {
  @ApiPropertyOptional({ enum: ['true', 'false'] })
  @IsOptional()
  @IsIn(['true', 'false'])
  approved?: 'true' | 'false';
}
