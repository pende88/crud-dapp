const Crud = artifacts.require('Crud');

contract('Crud', () => {
    let crud = null;

    before(async () => {
        crud = await Crud.deployed();
    });

    it('Should create a new user', async () => {
        await crud.create('Mark');
        const user = await crud.read(1);
        // we return array
        assert(user[0].toNumber() === 1);
        assert(user[1] === 'Mark');
    });

    it('Should update user', async () => {
        await crud.update(1, 'Stephen');
        const user = await crud.read(1);
        // we return array
        assert(user[0].toNumber() === 1);
        assert(user[1] === 'Stephen');
    });

    it('Should not update user', async () => {
        
        try{
            await crud.update(3, 'Jeremy');
        }catch(e) {
            assert(e.message.includes('User does not exist!'));
            return;
        }
        //if error was not thrown then test fails
        assert(false);
    });

    it('Should destroy a user', async () => {
        await crud.destroy(1);

        try{
            await crud.read(1);
        }catch(e) {
            assert(e.message.includes('User does not exist!'));
            return;
        }
        //if error was not thrown then test fails
        assert(false);
    });

    it('Should not destroy a non existing user', async () => {
        try{
            await crud.destroy(5);
        }catch(e) {
            assert(e.message.includes('User does not exist!'));
            return;
        }
        //if error was not thrown then test fails
        assert(false);
    });
});