import { Box } from '@mui/material';

function Technologies({elementId, styles}) {
    return (
        <Box id={elementId} sx={styles}>
            <img src={'./home/html.png'} width={'64px'} title='HTML' />
            <img src={'./home/css.png'} width={'64px'} title='CSS' />
            <img src={'./home/js.png'} width={'64px'} title='Javascript' />
            <img src={'./home/react.png'} width={'64px'} title='React' />
            <img src={'./home/electron.svg'} width={'64px'} title='Electron' />
            <img src={'./home/php.png'} width={'80px'} title='PHP' />
            <img src={'./home/nodejs.svg'} width={'120px'} height={'60px'} title='Node.js' />
            <img src={'./home/expressjs.svg'} width={'100px'} title='Express JS' />
            <img src={'./home/mysql.png'} width={'85px'} title='MySQL' />
            <img src={'./home/firebase.svg'} width={'64px'} title='Firebase' />
        </Box>
    )
}

export default Technologies