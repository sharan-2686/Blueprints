from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL ="postgresql://postgres.qwzicqpyogewrbjdakin:Virgotesla11&@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)