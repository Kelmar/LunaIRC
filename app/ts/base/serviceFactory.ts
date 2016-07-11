
export class ServiceFactory
{
    private m_map: Object;

    constructor()
    {
    }

    public getTypeName<T>(a: T): string
    {
        var rval: string = typeof a;

        if (rval == "object")
        {
            var proto = Object.getPrototypeOf(a);
            
            if ((proto != null) && (proto.constructor != null) && (proto.constructor.name != null))
                rval = proto.constructor.name;
        }
        
        return rval;
    }


    public getTypeName2<T>(type: { new(): T; }): string
    {
        return type.prototype.name;
    }

    public register<TInterface, TService extends TInterface>(
        interfaceType: any,
        serviceType: { new(): TService; }): void
    {
        //var foo = typeof TInterface;

        console.log("Interface: ", interfaceType.prototype);
        console.log("Service: ", serviceType.prototype);
    }
}

export interface ITest
{
    doThing(): void;
}

export class TestClassA implements ITest
{
    private value: number;

    constructor()
    {
        this.value = 5;
    }

    public doThing(): void
    {
        var sf = new ServiceFactory();
        
        //sf.getTypeName2(ITest);
        //sf.register(ITest, TestClassA);
    }
}
