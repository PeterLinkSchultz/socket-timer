module.exports = ({ file, options, env }) => ({
    parser: 'sugarss',
    plugins: {
        'autoprefixer': options.autoprefixer
    }
});