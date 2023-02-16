/**
 * @file Post
 * @module fixtures/pkg/post/Post
 */

import {
  IsDate,
  IsEmail,
  IsFQDN,
  IsInt,
  IsString,
  Length,
  Max,
  Min
} from 'class-validator'

class Post {
  @IsDate()
  public created_at!: Date

  @IsEmail()
  public email!: string

  @IsInt()
  @Min(0)
  @Max(10)
  public rating!: number

  @IsFQDN()
  public site!: string

  @IsString()
  public text!: string

  @Length(10, 20)
  public title!: string
}

export default Post
