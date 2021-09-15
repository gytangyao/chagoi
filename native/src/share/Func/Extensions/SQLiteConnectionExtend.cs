using System;
using System.Threading;
using share.Repository;

namespace share.Func.Extensions
{
    public static class SqLiteConnectionExtend
    {
        private static readonly object WriteLocker = new();
        public static int SafeUpdate<T>(this Jyh.Domain.Entities.Entity<T> entity)
        {
            try
            {
                return !Monitor.TryEnter(WriteLocker, TimeSpan.FromSeconds(10)) ? 0 : ConnectionFactory.Connection.Update(entity);
            }
            finally
            {
                Monitor.Exit(WriteLocker);
            }
        }

        public static int SafeInsert<T>(this Jyh.Domain.Entities.Entity<T> entity)
        {
            try
            {
                return !Monitor.TryEnter(WriteLocker, TimeSpan.FromSeconds(10)) ? 0 : ConnectionFactory.Connection.Insert(entity);
            }
            finally
            {
                Monitor.Exit(WriteLocker);
            }
        }

        public static int SafeExecute(this string query, params object[] args)
        {
            try
            {
                return !Monitor.TryEnter(WriteLocker, TimeSpan.FromSeconds(10)) ? 0 : ConnectionFactory.Connection.Execute(query, args);
            }
            finally
            {
                Monitor.Exit(WriteLocker);
            }
        }
    }
}
