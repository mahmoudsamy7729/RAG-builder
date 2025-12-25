from typing import Annotated
from fastapi import Depends, Request
from src.database import db_dependency 
from src.repository import RefreshTokenRepository
from redis.asyncio import Redis




def get_refresh_token_repo(db: db_dependency) -> RefreshTokenRepository:
    return RefreshTokenRepository(db)

token_depedency = Annotated[RefreshTokenRepository, Depends(get_refresh_token_repo)]



def get_redis(request: Request) -> Redis:
    return request.app.state.redis

redis_dependency = Annotated[Redis, Depends(get_redis)]