import { Box } from '@mui/material';

function Technologies({elementId, styles}) {
    return (
        <Box id={elementId} sx={styles}>
            <img src={'./src/public/home/html.png'} width={'64px'} title='HTML' />
            <img src={'./src/public/home/css.png'} width={'64px'} title='CSS' />
            <img src={'./src/public/home/js.png'} width={'64px'} title='Javascript' />
            <img src={'./src/public/home/react.png'} width={'64px'} title='React' />
            <img src={'./src/public/home/electron.svg'} width={'64px'} title='Electron' />
            <img src={'./src/public/home/php.png'} width={'80px'} title='PHP' />
            <img src={'./src/public/home/nodejs.svg'} width={'120px'} height={'60px'} title='Node.js' />
            <img src={'./src/public/home/expressjs.svg'} width={'100px'} title='Express JS' />
            <img src={'./src/public/home/mysql.png'} width={'85px'} title='MySQL' />
            <img src={'./src/public/home/firebase.svg'} width={'64px'} title='Firebase' />
        </Box>
    )
}

export default Technologies