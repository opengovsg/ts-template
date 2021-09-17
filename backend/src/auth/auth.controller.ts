import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AppLogger } from '../logger/logger.service'
import { AuthService } from './auth.service'
import { GenerateOtpDto, VerifyOtpDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(AuthController.name)
  }

  @Post()
  async generateOtp(
    @Res() res: Response,
    @Body() generateOtpDto: GenerateOtpDto
  ): Promise<void> {
    try {
      await this.authService.generateOtp(generateOtpDto)
      res.status(HttpStatus.OK).json({ message: 'OTP sent' })
    } catch (error: any) {
      this.logger.error({
        message: 'Error while generating authentication OTP',
        meta: {
          function: 'generateOtp',
        },
        error,
      })
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message })
    }
  }

  @Post('verify')
  async verifyOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() verifyOtpDto: VerifyOtpDto
  ): Promise<void> {
    try {
      const user = await this.authService.verifyOtp(verifyOtpDto)
      if (user) {
        Object.assign(req.session, { user })
        this.logger.log({
          message: `Successfully verified OTP for user ${verifyOtpDto.email}`,
          meta: { function: 'verifyOtp' },
        })
        res.status(HttpStatus.OK).json({ message: 'OTP verified' })
      } else {
        this.logger.warn({
          message: `Incorrect OTP given for ${verifyOtpDto.email}`,
          meta: { function: 'verifyOtp' },
        })
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Incorrect OTP given' })
      }
    } catch (error: any) {
      this.logger.error({
        message: 'Error while verifying authentication OTP',
        meta: {
          function: 'verifyOtp',
        },
        error,
      })
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message })
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    req.session.destroy(() =>
      res.status(HttpStatus.OK).json({ message: 'Logged out' })
    )
  }

  @Get('whoami')
  async whoami(@Req() req: Request, @Res() res: Response): Promise<void> {
    res.status(HttpStatus.OK).json(req.session.user || null)
  }
}
