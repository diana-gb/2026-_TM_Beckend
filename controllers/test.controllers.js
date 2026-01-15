class TestController{
    get(request, response){
        response.send('test realizado')
    }
}

const testController = new TestController()

export default testController