var mock = jest.genMockFromModule('./../fx-audio-api');

function navigator() {
    return {
        getUserMedia: function () {
        }
    }
}

mock.navigator.mockImplementation(navigator);

module.exports = mock;