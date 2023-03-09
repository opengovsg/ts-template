import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'

import { GenerateOtpDto, VerifyOtpDto } from '~shared/types/auth.dto'

import { ConfigService } from '../config/config.service'
import { UserSession } from '../types/session'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    @InjectPinoLogger(AuthController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  async generateOtp(
    @Res() res: Response,
    @Body() generateOtpDto: GenerateOtpDto,
  ): Promise<void> {
    try {
      await this.authService.generateOtp(generateOtpDto)
      res.status(HttpStatus.OK).json({ message: 'OTP sent' })
    } catch (error: any) {
      this.logger.error(error)
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message })
    }
  }

  @Post('verify')
  async verifyOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<void> {
    try {
      const user = await this.authService.verifyOtp(verifyOtpDto)
      if (user) {
        req.session.user = user
        this.logger.info(
          `Successfully verified OTP for user ${verifyOtpDto.email}`,
        )
        res.status(HttpStatus.OK).json({ message: 'OTP verified' })
      } else {
        this.logger.warn(`Incorrect OTP given for ${verifyOtpDto.email}`)
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Incorrect OTP given' })
      }
    } catch (error: any) {
      this.logger.error(error)
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message })
    }
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Session() session: UserSession,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    res.clearCookie(this.config.get('session.name'))
    session.destroy(() =>
      res.status(HttpStatus.OK).json({ message: 'Logged out' }),
    )
  }

  @Get('whoami')
  async whoami(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = req.session.user
    res
      .status(HttpStatus.OK)
      .json(user ? { id: user.id, email: user.email } : null)
  }
}
