using share.CoreConst;
using SQLite;

namespace share.Repository
{
    public class ConnectionFactory
    {
        private static SQLiteConnection _connection;
        public static SQLiteConnection Connection => _connection ??= new SQLiteConnection(DatabaseConst.ChagoiBarDbPath);
    }
}
