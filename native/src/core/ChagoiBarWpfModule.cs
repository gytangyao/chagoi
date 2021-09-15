﻿using Jyh.Modules;
using Jyh.Reflection.Extensions;
using share;

namespace core
{
    [DependsOn(typeof(ChagoiBarInfrastructureModule))]
    public class ChagoiBarWpfModule : JyhModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(ChagoiBarWpfModule).GetAssembly());
        }
    }

}
