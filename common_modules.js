module.exports = {
    context: 'some/subdirectory',
    modules: [
        {
            source: 'some/file',
            target: 'some/file'
        },
        {
            source: 'some/directory/*',
            target: 'some/directory/'
        },
        {
            source: 'http://some.domain/some/file',
            target: 'some/file'
        }
    ]
};
