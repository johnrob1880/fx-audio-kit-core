var mock = jest.genMockFromModule('./../fx-audio-context');

var _context;

function __setContext (context) {
    console.log('context set', context);
    _context = context;
}
function getContext() {
    return _context;
}

mock.getContext.mockImplementation(getContext);

mock.__setContext = __setContext;

module.exports = mock;