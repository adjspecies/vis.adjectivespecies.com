//Array structure: 

//uid,birthyear,gender,"Faith and spirituality is a good way of understanding the world","My friends look to me for advice about movies, music, video games, or pop culture","In general, I'd rather make something instead of buying it","I'm more talented than most people in my peer group","I value having cutting-edge technology","I'd rather patronize a small business than a big company","Creativity is one of my strongest attributes","Where pop culture is concerned, I'm ahead of the curve","I admit, I have a tendency to overthink things","Mass media is too 'lowest common denominator' for my tastes","I enjoy being able to lead and influence others","I tend to focus on a few specific interests of mine","It's important to learn more about other countries","People are too reliant on technology these days","Even if technically illegal, file-sharing of copyrighted material isn't that big a deal","It's important for people to be politically active","In general, I want to be considered fashionable","Doing new things is an engaging, fun challenge","It's better to have an exciting life than one where every day is predictable","I believe in learning for learning's sake -- it doesn't need to have a purpose","I find a sense of routine comforting","Advertising is a useful source of information","What other people think of me is important","I like learning about how the universe works","When something is confusing, it's better to find a simpler option than to spend time trying to figure it out","My decisions are motivated primarily by my moral code","People are more distant from each other these days","I'm often the first person in my group of friends to try something new","I consider myself to be an intellectual","I have a tendency to buy things on impulse","I find corporations, and corporate products, rather soulless and uninspiring","I enjoy traveling and discovering new things and places"

var schema = [,"Faith and spirituality is a good way of understanding the world","My friends look to me for advice about movies, music, video games, or pop culture","In general, I'd rather make something instead of buying it","I'm more talented than most people in my peer group","I value having cutting-edge technology","I'd rather patronize a small business than a big company","Creativity is one of my strongest attributes","Where pop culture is concerned, I'm ahead of the curve","I admit, I have a tendency to overthink things","Mass media is too 'lowest common denominator' for my tastes","I enjoy being able to lead and influence others","I tend to focus on a few specific interests of mine","It's important to learn more about other countries","People are too reliant on technology these days","Even if technically illegal, file-sharing of copyrighted material isn't that big a deal","It's important for people to be politically active","In general, I want to be considered fashionable","Doing new things is an engaging, fun challenge","It's better to have an exciting life than one where every day is predictable","I believe in learning for learning's sake -- it doesn't need to have a purpose","I find a sense of routine comforting","Advertising is a useful source of information","What other people think of me is important","I like learning about how the universe works","When something is confusing, it's better to find a simpler option than to spend time trying to figure it out","My decisions are motivated primarily by my moral code","People are more distant from each other these days","I'm often the first person in my group of friends to try something new","I consider myself to be an intellectual","I have a tendency to buy things on impulse","I find corporations, and corporate products, rather soulless and uninspiring","I enjoy traveling and discovering new things and places"];

var shortnames = ["Faith and spirituality", "Friends seek my advice", "Rather make than buy", "More talented", "Technological", "Small-businesses prefered", "Creative", "Hip", "Overthinker", "Not into mass media", "Influential or leader", "Focused", "Learn about other countries", "Too reliant on tech", "File-sharing okay", "Politically active", "Fashionable", "New things", "Excitement over routine", "Learning", "Routine comforting", "Advertising is useful", "Important what others think", "Like learning", "Simpler alternatives", "Moral", "People are distant now", "First at new things", "Intellectual", "Impulsive", "Anti-corporate", "Enjoy travel"];

var responses = [[4,1981,'m',2,2,2,3,3,2,2,1,3,3,3,3,4,2,3,4,2,3,2,4,3,2,3,4,2,3,1,2,4,2,2,2],[3,1985,'f',1,3,4,3,4,3,4,2,4,3,4,3,4,2,4,2,2,2,3,4,3,2,3,4,1,2,2,1,4,3,4,3],[5,1985,'f',1,4,5,6,5,6,6,3,6,5,4,5,4,4,6,2,2,4,4,6,5,4,5,5,2,2,2,4,6,4,5,4],[6,1996,'g',2,4,4,5,6,6,4,4,6,6,5,6,6,3,6,6,4,5,4,6,5,2,4,6,4,4,4,3,5,4,5,6],[7,1991,'m',1,6,4,6,6,4,4,4,6,4,5,5,5,2,3,5,4,5,4,6,4,4,3,6,2,4,3,5,6,4,4,5],[8,1993,'m',2,5,3,2,1,4,5,2,6,4,4,5,6,6,2,6,6,4,5,5,4,5,1,5,2,6,3,5,6,6,5,6],[9,1996,'m',1,5,4,3,6,5,6,3,6,5,6,6,3,6,6,1,1,6,6,4,6,1,3,5,6,5,6,5,5,6,6,5],[10,1996,'m',4,5,4,3,6,5,5,3,3,4,4,4,6,5,5,4,4,6,5,5,5,6,4,6,4,4,6,5,4,6,4,6],[11,1993,'f',2,4,6,5,5,3,6,4,5,3,2,5,4,5,4,3,2,4,4,3,5,6,4,2,3,5,5,3,4,4,4,6],[12,0000,'x',2,3,3,4,5,5,4,4,4,4,3,5,5,4,5,5,5,5,5,5,4,2,5,3,3,5,5,4,5,5,2,4],[13,1985,'m',3,4,3,1,5,2,5,2,6,3,5,5,3,5,3,1,4,4,6,2,5,5,1,3,5,4,5,3,4,4,5,5],[14,1995,'m',4,4,4,4,5,5,4,2,5,5,5,5,5,5,5,3,3,5,5,5,5,4,3,4,4,5,4,3,5,5,4,5],[15,1995,'m',4,3,3,4,6,5,5,4,5,4,5,6,5,4,6,3,3,3,4,3,4,5,3,5,6,4,5,5,4,6,3,5],[16,1991,'g',1,4,3,5,4,6,2,2,6,6,4,5,3,4,6,4,4,2,3,3,5,1,6,5,3,2,5,1,5,4,6,2],[17,1991,'m',1,2,2,4,6,4,2,2,4,5,4,6,4,2,5,4,1,6,5,4,4,2,1,5,1,4,5,6,5,4,5,4],[18,1978,'m',2,5,4,4,4,4,6,3,5,4,4,4,5,6,2,4,2,5,5,5,4,4,4,4,2,1,5,5,4,4,4,5],[19,1985,'m',3,3,2,5,3,3,2,1,5,6,5,6,5,5,5,4,1,6,5,6,4,3,3,6,1,5,2,2,5,2,5,3],[20,1980,'m',2,2,1,2,5,4,4,2,4,3,4,5,5,2,4,4,3,5,4,5,3,2,4,4,2,3,4,3,4,3,2,5],[21,1986,'m',6,4,5,6,6,6,5,3,5,5,5,5,4,3,6,4,3,6,6,3,5,3,5,5,3,6,3,4,5,4,4,6],[22,1986,'m',4,4,3,5,6,5,4,2,4,5,4,6,5,5,6,4,2,6,6,3,6,3,5,5,6,4,6,3,5,5,4,6],[23,1991,'f',4,4,4,4,5,6,3,2,6,5,5,5,6,5,6,6,2,5,4,6,5,3,5,5,4,4,5,2,6,5,6,5],[24,1986,'f',1,4,3,4,6,6,5,3,6,5,3,5,5,1,4,5,4,5,5,6,4,2,5,6,3,5,4,4,5,5,5,4],[25,1991,'m',6,2,3,2,4,6,4,1,6,6,4,5,5,6,6,1,6,6,6,1,5,5,6,5,2,6,5,2,2,2,5,5],[26,1996,'m',2,3,2,2,6,4,3,1,1,6,3,3,4,6,4,4,1,5,5,3,2,4,2,2,3,5,4,3,3,1,2,6],[27,1969,'m',3,3,3,3,5,3,5,2,5,6,4,5,5,5,2,4,3,4,4,5,4,3,2,6,4,3,3,2,6,4,5,3],[28,1989,'f',3,4,5,4,4,4,6,3,6,4,4,5,6,5,4,5,2,4,3,6,6,5,5,6,3,6,5,3,5,2,3,4],[29,1989,'m',1,2,4,4,5,5,5,1,5,4,5,5,5,5,6,4,2,5,5,6,4,2,1,6,3,4,5,4,5,5,5,5],[30,1991,'m',1,5,2,4,6,3,3,1,4,4,5,6,2,2,4,1,2,4,5,4,5,2,4,4,3,6,4,4,5,2,2,1],[31,1984,'g',2,2,5,1,4,6,1,3,5,5,4,5,4,4,6,5,2,4,4,4,2,2,4,5,2,5,5,2,5,3,6,4],[32,1987,'m',2,3,5,4,5,5,4,2,4,4,3,4,5,4,4,4,2,5,5,5,2,2,3,6,3,5,4,5,5,2,5,5],[33,1996,'m',4,4,5,3,4,3,6,4,6,4,6,5,5,5,3,4,2,5,6,5,4,3,1,4,5,6,4,5,5,1,4,5],[34,1993,'f',4,2,2,5,6,4,2,2,1,2,6,6,4,1,2,4,1,6,6,6,1,2,1,5,6,3,5,6,4,5,2,6],[35,1986,'f',2,5,5,3,6,2,4,2,5,5,3,5,4,5,2,5,2,5,3,5,3,3,3,6,1,6,6,5,5,4,4,6],[36,1990,'m',6,2,4,3,5,6,3,1,5,3,3,6,6,6,5,4,4,5,4,5,5,3,5,5,5,3,4,4,4,5,4,6],[37,1981,'m',4,4,5,5,6,6,4,4,6,5,5,6,5,3,4,4,5,6,4,5,4,5,5,6,3,6,6,6,5,5,4,6],[38,1987,'m',3,2,3,3,4,4,4,5,4,5,1,5,6,4,5,5,4,4,3,6,5,3,2,6,1,6,6,1,5,3,6,4],[39,1992,'a',3,2,6,6,4,5,5,1,6,4,5,6,6,4,6,2,1,6,5,6,5,3,2,6,3,2,4,3,6,5,5,6],[40,1994,'m',1,4,3,6,5,4,4,6,6,4,5,5,6,5,6,2,5,6,6,4,4,4,5,5,1,5,6,5,5,5,3,6],[41,1983,'m',5,5,6,3,2,6,5,3,5,6,4,5,5,6,2,5,2,4,5,6,3,3,3,5,2,6,5,4,4,5,5,5],[42,1988,'m',2,3,5,4,6,5,4,2,5,5,4,5,4,2,5,4,4,5,5,5,4,4,4,6,2,5,3,6,5,5,6,4],[43,1996,'m',2,5,3,3,5,3,3,3,6,5,4,4,5,4,2,4,6,4,6,6,1,4,6,6,2,4,5,4,3,4,5,6],[44,1992,'m',6,3,4,5,4,5,6,2,6,6,3,5,6,5,6,5,3,5,5,6,5,2,3,6,1,6,6,5,5,4,6,6],[45,1965,'m',3,5,3,3,2,4,4,3,4,4,5,3,5,4,5,5,3,4,4,5,5,2,5,5,4,4,4,2,5,3,4,6],[46,1996,'f',5,4,4,4,5,5,6,3,5,3,4,5,5,5,5,1,4,4,5,5,4,4,4,5,4,5,5,4,5,4,5,5],[47,1992,'m',4,5,5,3,5,5,5,5,5,6,4,6,6,6,4,4,4,6,5,5,5,4,4,4,5,4,6,5,5,5,6,6],[48,1993,'m',5,3,3,4,4,5,4,4,6,6,3,5,6,3,5,5,4,4,3,6,5,2,5,5,4,5,5,3,5,4,5,4],[49,1990,'m',4,4,5,4,5,5,5,3,5,6,4,5,6,5,2,5,5,5,5,5,2,4,4,5,2,5,5,4,4,4,4,6],[50,1998,'f',6,4,5,2,4,4,6,4,6,3,6,6,5,6,3,5,3,6,3,6,5,5,3,2,3,4,4,2,3,4,4,5],[51,1987,'g',4,5,3,6,6,5,6,1,6,6,4,2,4,1,4,5,1,6,6,6,1,4,4,6,2,2,2,6,6,5,4,6],[52,1994,'m',1,5,2,5,6,5,5,5,5,5,4,5,5,2,6,5,2,5,4,6,5,1,1,5,2,1,2,5,5,2,2,5],[53,1988,'m',4,5,6,4,5,5,5,1,4,4,5,4,6,5,5,5,3,5,6,5,1,5,4,6,6,6,4,2,3,4,3,5],[54,1992,'f',3,4,5,5,4,5,5,4,5,4,5,4,6,4,5,5,4,5,5,5,4,2,3,5,3,5,5,4,6,4,4,6],[55,1996,'g',1,2,3,4,5,2,5,2,4,4,2,5,5,1,4,4,2,5,4,5,5,1,5,5,4,4,3,4,5,2,5,5],[56,1989,'m',1,1,5,4,4,5,6,3,5,5,3,5,5,4,6,5,1,5,5,4,3,1,2,6,2,6,5,4,4,3,4,5],[57,1991,'f',1,4,3,3,2,5,5,4,6,4,3,6,5,6,4,4,4,3,6,4,3,4,3,5,2,3,4,5,5,2,4,2],[58,1992,'m',4,3,6,4,3,1,5,1,6,5,5,6,6,6,6,4,2,5,6,6,2,1,4,5,5,6,6,5,6,6,6,6],[59,1992,'m',2,2,6,5,6,5,3,2,6,6,2,5,5,3,5,3,5,5,4,6,3,1,6,6,2,2,4,4,6,5,3,3],[60,1988,'a',3,4,4,4,4,5,3,3,6,3,5,5,5,5,5,5,3,4,5,2,3,3,5,6,2,6,6,4,5,6,6,6],[61,1993,'m',3,5,5,4,5,5,5,3,6,4,4,5,5,4,4,5,5,5,5,6,4,3,5,6,2,2,4,4,4,4,5,5],[62,1988,'m',3,5,4,3,4,6,4,4,6,4,4,5,5,5,6,5,2,5,4,5,5,3,6,6,3,6,5,4,5,5,5,3],[63,1992,'m',1,5,5,5,4,6,5,4,6,4,5,5,4,6,6,2,4,6,6,6,3,4,1,6,2,6,6,5,6,5,5,6],[64,1980,'f',5,5,6,6,5,5,6,2,6,6,5,2,6,1,6,5,4,5,3,6,6,1,3,6,2,5,6,5,6,6,4,5],[65,1989,'m',1,3,3,3,2,3,2,5,4,5,5,3,6,5,5,5,2,5,5,6,4,4,4,5,5,4,5,6,6,5,4,6],[66,1995,'f',3,3,5,6,2,5,6,2,6,4,4,5,4,6,4,4,2,6,5,2,4,3,5,6,4,4,6,6,4,2,4,5],[67,1997,'m',2,4,5,4,4,1,4,3,5,4,5,5,5,5,5,4,3,5,6,5,2,1,1,5,4,4,5,5,4,2,5,4],[68,1990,'m',4,5,4,4,6,5,5,5,5,4,5,5,6,2,4,6,5,5,5,5,4,3,4,5,3,5,4,4,5,4,4,6],[69,1987,'m',1,1,4,5,2,4,4,2,5,5,4,5,6,3,2,4,5,6,4,6,3,4,2,6,4,2,3,3,6,1,3,4],[70,1995,'m',4,2,5,4,6,6,6,3,4,5,5,4,6,4,6,2,6,5,6,2,4,3,6,6,5,2,6,5,4,6,6,6],[71,1993,'f',3,2,6,3,2,6,6,2,4,6,4,6,4,5,5,5,2,5,5,5,2,5,1,5,3,5,5,5,5,5,5,6],[72,1995,'m',6,3,3,2,5,1,6,2,2,3,4,6,5,5,4,3,3,5,6,5,4,5,4,2,4,6,6,5,4,4,3,6],[73,1989,'m',2,2,5,4,6,5,1,1,6,5,4,6,5,5,5,5,1,5,5,4,4,1,6,5,4,4,3,4,5,3,5,4],[74,0000,'x',1,4,3,3,5,4,2,2,5,3,3,5,4,2,4,4,2,4,2,6,5,1,4,5,2,2,4,4,6,1,4,3],[75,1991,'m',5,4,4,4,4,4,3,2,5,4,4,5,5,4,5,4,2,5,4,5,4,3,2,5,2,6,5,3,5,2,5,6],[76,1998,'m',1,6,1,6,6,3,6,5,5,6,6,6,6,1,4,4,4,6,6,3,3,3,5,5,4,5,4,5,5,6,2,4],[77,1995,'m',1,4,4,4,4,5,5,4,4,5,4,5,4,3,4,4,3,5,5,2,4,3,4,6,4,4,4,5,5,2,5,6],[78,1990,'m',1,6,4,6,4,3,6,5,5,2,5,4,5,6,4,3,6,6,6,6,2,4,5,6,2,5,6,5,6,4,3,6],[79,1959,'m',4,4,5,5,2,5,6,2,5,6,6,5,5,5,5,6,2,6,5,6,5,4,5,6,3,5,5,3,5,5,5,6],[80,1979,'m',5,2,3,4,4,4,4,3,5,4,4,4,5,2,4,5,3,4,3,5,4,3,4,6,2,4,2,4,5,3,3,4],[81,1990,'m',5,2,4,3,5,5,4,4,4,4,2,5,4,5,3,3,2,5,4,5,3,1,2,5,3,5,5,4,3,3,5,4],[82,1993,'m',6,4,3,6,4,3,6,1,6,4,4,6,4,6,5,2,6,6,3,5,5,3,6,5,4,4,4,4,6,5,3,4],[83,1982,'m',3,3,2,3,5,4,2,3,4,3,5,5,5,3,3,5,4,4,4,6,5,4,4,6,2,4,4,4,5,5,4,5],[84,1996,'m',3,5,4,2,5,4,5,2,5,3,2,5,5,5,4,2,4,5,4,5,4,4,4,3,4,3,5,2,1,4,4,5],[85,1993,'f',4,1,5,2,1,4,3,1,5,4,5,3,4,5,3,3,2,5,6,6,4,5,4,4,3,4,5,2,4,5,4,6],[86,1990,'g',1,5,6,4,2,6,5,3,2,5,5,2,5,5,5,6,5,6,6,5,1,1,5,5,1,1,4,5,5,3,5,6],[87,1986,'m',5,4,6,2,1,5,4,1,5,5,3,5,5,6,1,5,1,5,3,4,4,2,4,6,3,6,4,6,5,5,4,6],[88,1991,'m',4,5,3,2,5,6,4,2,6,5,4,5,6,4,4,6,5,5,4,6,4,5,6,6,3,3,5,4,6,4,4,5],[89,1995,'f',4,4,5,5,5,5,4,2,6,2,5,2,4,4,5,3,4,5,4,6,5,4,3,4,2,4,5,5,5,5,6,5],[90,1984,'x',2,6,4,4,2,6,5,1,4,6,4,5,6,6,4,4,1,5,5,6,4,1,2,6,1,6,6,3,5,3,6,4],[91,1986,'g',4,3,6,4,4,5,6,4,6,4,3,5,5,1,4,4,4,5,5,6,4,5,4,6,2,5,3,5,5,4,4,5],[92,1995,'a',2,5,4,4,6,5,3,3,3,3,3,4,5,2,6,4,4,5,5,6,3,2,3,6,4,4,4,5,5,4,5,5],[93,1992,'m',3,5,6,4,4,6,6,3,5,3,4,6,5,4,5,6,5,6,6,5,4,3,3,5,3,6,4,5,6,5,5,6],[94,1985,'f',5,6,5,3,2,5,6,5,5,3,5,5,5,3,5,2,2,5,5,6,3,4,4,5,2,5,6,5,5,5,4,6],[96,1992,'m',3,4,4,3,5,5,5,1,5,5,5,4,5,4,2,6,2,4,3,6,5,2,3,5,2,6,4,3,5,4,4,4],[97,1993,'m',6,3,4,4,4,4,6,2,5,5,5,3,6,5,4,5,4,5,4,4,5,3,4,6,3,5,5,2,6,4,3,4],[98,1992,'m',4,4,4,4,5,4,5,3,5,5,5,4,5,3,1,6,2,4,3,6,5,2,3,5,3,6,4,3,6,4,4,4],[99,1987,'m',2,2,4,4,6,5,5,3,6,1,5,6,5,3,3,5,6,5,5,6,5,3,5,6,3,5,3,4,6,2,2,6],[100,1995,'m',3,6,4,4,6,4,6,3,6,6,5,5,4,4,4,5,2,6,3,5,5,6,1,6,6,3,5,4,5,5,5,6],[101,0000,'x',4,6,1,4,6,1,5,6,4,4,6,4,2,1,6,3,4,4,3,2,6,4,5,1,4,3,1,3,5,5,2,2],[102,1995,'m',5,6,2,5,4,3,6,5,5,2,5,5,5,5,4,4,6,5,6,5,5,4,6,4,4,4,5,5,5,5,2,5],[103,1989,'f',5,2,5,3,4,4,5,2,5,5,5,5,5,4,5,5,3,5,5,5,4,5,3,5,3,5,6,3,4,4,4,4],[104,1998,'m',1,4,3,2,6,5,4,5,6,4,4,3,5,2,5,4,4,5,4,6,4,4,5,6,2,3,2,4,5,3,2,4],[105,1995,'f',5,4,5,4,4,3,5,3,5,4,2,5,2,6,6,3,3,4,5,2,4,2,1,3,5,3,5,4,4,4,4,5],[106,1990,'m',4,6,4,1,6,2,6,6,6,1,2,5,4,3,6,4,3,6,4,6,6,6,4,6,6,6,1,4,5,6,1,6],[107,1995,'m',5,5,5,4,6,2,6,5,6,6,2,6,6,4,3,1,1,6,6,6,6,1,1,6,2,5,6,2,5,5,6,6],[108,1995,'m',5,3,4,5,6,4,5,2,5,4,5,5,5,2,5,3,4,5,6,6,5,3,2,6,6,6,3,5,6,1,4,4],[109,1993,'m',1,4,6,4,6,5,4,1,4,4,4,5,4,2,5,4,4,5,4,5,4,2,3,6,2,6,2,5,5,5,3,5],[110,1998,'m',6,6,6,5,6,1,6,4,6,6,6,6,6,3,6,6,5,6,4,3,6,4,1,6,6,6,1,6,6,4,1,6],[111,1992,'m',5,4,5,3,5,3,5,4,6,3,5,5,4,5,2,3,4,5,5,4,4,5,4,5,3,4,2,5,4,5,5,5],[112,1995,'m',2,4,3,4,6,6,4,4,5,3,5,5,5,3,6,5,2,5,5,6,4,4,5,6,3,5,5,3,5,5,5,6],[113,1998,'m',4,5,5,2,6,5,5,1,6,6,4,5,6,6,5,1,3,5,6,6,4,2,2,5,2,6,6,3,4,6,6,5],[114,1996,'m',4,5,6,2,4,5,5,2,4,5,6,6,5,6,6,1,5,6,6,5,4,4,2,6,2,5,6,6,5,5,4,6],[115,1991,'m',4,2,5,4,5,5,5,2,5,4,4,5,4,5,5,6,5,5,5,5,4,2,3,4,2,5,5,4,5,4,6,5],[116,1992,'m',2,4,3,4,2,5,4,1,6,5,4,5,3,5,6,3,3,5,5,5,4,3,5,6,3,4,5,4,5,2,5,6],[117,1993,'x',3,3,4,4,4,5,5,2,5,6,5,2,5,4,4,5,2,6,5,6,5,1,4,6,1,4,3,3,6,4,4,5],[118,1993,'m',2,4,5,5,4,3,5,2,5,4,6,5,4,4,4,4,4,5,5,4,4,4,4,6,3,2,6,6,4,3,4,6],[119,1989,'m',2,2,5,5,4,5,6,2,6,5,5,4,5,6,6,1,3,6,4,6,4,2,4,6,3,5,5,5,5,4,3,4],[120,1991,'f',3,4,4,4,3,5,3,1,6,5,6,6,6,6,5,3,4,6,5,6,6,2,2,6,3,5,6,4,6,4,4,5],[121,1989,'m',5,4,2,1,6,6,3,1,6,4,5,1,5,5,5,5,3,5,3,5,6,2,6,5,2,5,6,2,4,6,6,5],[122,1993,'m',5,5,5,5,5,5,6,4,5,4,5,5,6,5,2,5,3,5,5,4,4,5,5,6,4,6,3,4,6,2,3,5],[123,1993,'f',3,4,4,2,4,5,4,2,4,4,4,3,5,4,4,3,3,5,4,4,4,4,4,5,2,4,5,4,5,5,3,3],[124,1984,'m',1,2,2,1,4,3,4,1,4,6,2,5,6,2,1,1,1,2,1,6,6,2,1,6,4,6,2,1,4,1,3,6],[125,1995,'m',3,3,3,4,5,4,3,4,4,4,4,4,5,5,4,4,3,5,5,4,4,2,5,3,3,4,5,3,4,2,5,5],[126,1995,'m',4,5,3,4,5,5,1,2,5,4,1,6,4,3,5,2,3,4,4,5,4,4,5,5,6,6,5,3,3,6,5,3],[127,1993,'m',2,4,2,5,4,4,5,3,5,2,6,5,5,5,6,6,3,4,5,5,5,2,6,4,3,5,5,3,5,5,2,5],[207,1992,'a',2,6,4,6,6,5,5,1,6,5,5,6,6,1,6,2,2,5,5,5,4,3,1,5,3,5,4,2,6,6,5,6],[129,1997,'m',2,1,2,5,3,4,2,2,5,5,5,6,4,3,5,3,2,5,5,5,5,3,4,5,4,4,6,2,6,2,4,4],[130,1989,'m',1,2,5,6,5,6,5,4,6,6,5,4,5,4,4,2,1,5,5,4,2,2,2,6,5,4,2,4,6,1,6,5],[131,1985,'f',1,5,6,3,4,5,6,2,5,6,5,6,5,2,5,5,4,5,3,6,2,5,4,6,3,5,3,4,6,4,3,4],[132,1990,'m',2,4,4,4,6,4,3,2,5,5,4,5,4,4,4,5,4,3,5,4,5,2,5,6,5,5,4,2,4,2,6,3],[133,1992,'m',3,3,5,3,4,4,3,2,5,4,4,5,4,5,5,4,3,5,6,4,4,3,3,6,3,3,3,3,5,5,3,5],[134,1979,'m',4,6,2,3,6,6,5,2,4,4,4,5,6,2,4,5,2,6,6,6,4,4,4,4,5,5,3,4,4,5,4,6],[135,0000,'x',3,2,4,6,1,2,4,2,3,4,2,5,4,4,3,2,3,3,3,5,4,3,1,5,5,6,3,6,4,1,4,4],[136,1990,'m',5,5,4,1,4,3,4,4,6,3,4,6,5,4,1,3,3,6,4,5,4,6,3,5,5,4,5,6,4,4,5,6],[137,1991,'m',6,2,6,3,5,4,5,3,5,4,5,5,5,3,5,4,4,5,4,6,5,3,4,6,4,6,2,2,5,4,4,5],[138,1991,'m',1,5,3,5,3,5,5,2,4,5,5,5,6,2,6,6,2,5,5,5,4,2,3,6,3,5,2,4,5,4,5,5],[139,1994,'m',6,2,4,4,6,4,4,2,6,4,4,5,4,5,3,4,3,5,6,4,4,4,5,4,6,6,5,4,5,2,4,4],[140,1991,'f',1,4,6,4,3,5,4,5,6,6,4,5,5,5,5,4,4,4,6,5,5,1,4,5,3,5,5,4,5,4,6,4],[141,1995,'m',1,5,6,6,4,6,6,3,5,4,4,5,5,6,4,4,2,5,6,5,3,5,2,4,4,4,6,6,3,3,4,5],[143,1992,'m',3,5,4,5,5,5,2,6,6,4,4,4,5,5,4,5,5,6,4,6,3,4,6,5,3,6,5,4,5,3,3,5],[144,1993,'a',4,3,4,5,4,1,6,3,6,4,5,5,6,5,6,4,3,5,4,6,5,5,3,6,3,4,5,4,6,3,6,5],[145,1992,'m',6,5,6,4,6,6,6,4,5,6,6,6,6,6,5,2,1,6,6,6,3,3,2,5,3,2,6,6,4,6,6,6],[146,1991,'m',4,3,5,2,4,2,3,3,5,5,4,2,5,5,5,2,2,5,5,2,2,3,2,5,2,3,5,3,3,3,3,4],[147,1995,'f',2,6,6,5,4,5,6,4,6,4,6,5,6,4,6,4,6,6,6,6,4,5,2,4,3,3,5,6,6,4,4,6],[148,1987,'m',5,4,5,2,4,4,5,3,5,4,4,5,5,5,2,5,4,5,6,5,1,3,1,6,5,3,5,4,4,4,2,6],[149,1992,'f',4,5,4,5,6,5,5,1,4,2,5,5,6,1,6,4,5,5,5,4,5,2,3,5,3,5,5,5,4,6,5,6],[150,1991,'m',1,4,3,1,4,1,1,3,5,1,4,6,5,1,6,5,2,4,6,6,5,6,3,5,5,1,1,4,5,5,1,2],[151,1991,'m',1,4,2,3,2,3,5,2,5,3,4,5,5,2,3,4,2,4,4,6,5,1,5,6,3,3,5,1,6,5,2,5],[152,1992,'m',2,1,3,4,3,6,5,1,5,4,5,5,6,5,4,4,2,6,4,6,4,2,2,6,2,4,5,5,6,1,6,5],[153,1976,'m',4,3,4,4,6,5,6,3,6,6,3,5,6,6,4,3,3,5,6,5,4,5,3,6,5,5,5,4,5,4,5,5],[154,1998,'f',6,2,4,6,5,5,6,2,5,4,2,5,5,2,6,4,2,5,6,6,3,3,3,5,4,5,5,5,5,2,4,5],[155,1993,'m',1,2,1,4,3,5,5,3,5,6,2,5,4,4,4,4,5,4,3,3,5,2,5,4,5,5,4,3,4,5,2,2],[156,1993,'m',5,3,3,3,3,4,4,3,4,2,4,5,5,4,3,4,3,5,5,4,5,4,2,5,5,3,4,3,3,4,2,4],[157,1981,'m',2,2,2,4,5,3,2,2,6,4,5,5,6,3,4,5,1,3,3,6,5,2,4,6,2,5,1,2,6,4,3,3],[158,1990,'m',2,4,4,5,6,3,3,4,6,1,6,5,4,2,1,4,4,5,5,6,4,2,5,5,3,5,2,4,6,6,2,5],[159,1991,'g',1,3,2,6,2,6,4,5,6,4,2,5,6,6,5,6,2,4,5,6,6,3,5,6,5,5,6,2,6,5,6,6],[160,1991,'m',5,5,4,4,5,4,5,5,6,5,4,4,4,5,4,4,5,6,6,5,6,4,5,6,3,5,6,4,5,6,4,6],[161,1992,'f',2,4,4,3,5,3,6,3,5,2,4,5,4,4,5,2,2,6,5,2,4,2,4,6,6,4,6,4,5,5,5,6],[206,1993,'m',5,2,3,4,6,5,6,2,3,3,4,5,5,4,3,5,3,5,5,5,5,4,5,5,3,5,5,3,5,2,2,6],[163,1993,'f',4,5,6,5,6,6,6,3,5,6,6,6,5,6,5,4,4,6,6,5,4,6,5,3,3,6,6,6,5,5,6,5],[164,1992,'m',4,6,3,5,4,1,5,3,5,6,5,5,5,5,4,5,4,6,5,6,4,4,2,6,1,4,5,4,5,2,5,6],[165,1986,'m',2,4,2,5,3,4,3,3,4,6,5,5,4,2,5,4,2,5,5,5,5,4,6,5,3,4,5,4,5,5,4,2],[166,1992,'m',3,4,5,5,4,3,5,3,4,4,5,4,4,5,6,2,4,5,6,6,4,4,2,4,3,4,5,5,5,2,4,6],[167,1994,'f',3,4,6,5,2,3,6,4,5,4,4,5,5,4,4,5,4,5,5,3,4,5,2,2,4,5,5,5,4,2,4,6],[168,1990,'m',4,3,4,5,6,4,5,2,6,4,5,6,5,5,5,5,4,5,5,5,5,3,5,6,4,5,4,4,6,5,4,5],[169,1987,'f',6,5,2,5,2,4,6,2,1,6,5,2,5,5,4,5,5,6,4,6,5,4,1,6,1,5,4,5,6,1,2,6],[170,1996,'m',6,4,6,6,1,6,6,2,4,5,6,1,6,5,2,5,3,6,6,5,1,2,5,6,1,6,5,5,6,2,2,6],[171,1992,'m',4,4,4,3,4,5,5,2,5,2,5,4,4,1,5,2,4,6,5,5,4,2,4,5,3,4,4,5,5,5,4,6],[172,1995,'m',3,4,3,4,5,3,4,4,4,4,4,5,4,3,6,3,5,5,6,5,3,4,5,4,5,4,4,5,5,5,4,5],[173,1987,'m',4,4,4,4,5,6,6,3,6,4,4,6,6,5,6,1,2,6,6,6,4,4,3,6,3,4,5,4,6,4,5,6],[174,1989,'m',1,6,2,3,5,2,5,4,6,4,4,5,5,5,5,2,4,6,6,5,5,6,2,4,2,5,5,5,4,5,2,5],[175,1986,'g',2,4,3,4,5,4,4,2,5,6,5,5,3,3,6,4,4,5,4,5,2,3,4,5,3,4,5,4,5,5,5,5],[176,1989,'m',2,3,3,4,4,5,3,1,5,5,4,4,5,4,4,4,1,5,4,6,5,4,2,6,2,6,4,3,6,4,4,3],[177,1984,'m',6,5,4,3,6,2,5,1,5,6,5,5,5,5,4,5,1,6,6,4,3,4,2,6,2,6,6,5,4,5,6,5],[178,1984,'m',6,5,4,3,6,2,5,1,5,6,5,5,5,5,4,5,1,6,6,4,3,4,2,6,2,6,6,5,4,5,6,5],[179,1995,'m',2,2,6,5,5,5,6,4,5,4,5,5,5,5,6,3,5,5,5,6,4,4,4,5,4,5,5,5,5,4,5,5],[180,1996,'f',6,6,5,5,6,6,6,5,6,2,4,6,5,4,1,4,4,5,5,6,5,6,3,4,4,5,5,3,5,6,3,6],[181,1982,'m',1,2,5,5,6,6,4,2,6,5,1,6,5,2,3,2,4,5,5,3,2,1,3,5,3,4,6,2,5,6,5,4],[182,1995,'m',2,2,4,4,4,6,3,1,4,5,4,5,5,4,4,5,1,5,5,6,5,4,3,5,2,6,2,3,4,2,2,4],[205,1992,'m',1,3,5,2,5,5,1,2,6,4,4,6,6,5,5,6,3,5,4,6,5,1,3,6,1,4,5,4,6,2,3,6],[185,1983,'f',3,4,5,5,5,5,5,3,6,5,5,5,5,4,4,5,3,5,4,5,5,4,3,5,2,4,4,5,5,3,4,5],[186,1994,'m',3,3,3,4,6,5,4,2,5,4,4,5,4,3,3,1,4,5,6,4,4,4,5,4,5,5,4,5,5,5,4,6],[187,1985,'f',5,3,4,2,3,6,4,2,3,4,4,4,5,6,5,5,4,5,4,6,3,5,2,6,3,5,5,5,5,6,4,5],[188,1994,'m',5,3,2,5,6,4,5,3,6,5,2,6,5,5,5,3,4,4,4,5,6,5,1,6,4,6,4,4,5,3,4,6],[189,1983,'f',5,2,3,3,4,5,5,3,6,3,3,6,5,4,4,4,3,6,4,5,4,3,5,5,4,4,3,5,4,4,4,5],[190,1987,'m',4,5,6,4,5,6,3,5,6,6,6,5,6,5,6,6,6,6,6,6,5,1,4,6,4,5,3,6,6,4,6,6],[191,1981,'m',5,4,3,3,4,4,5,2,6,4,1,6,4,3,5,3,3,5,4,6,3,1,2,5,2,5,3,3,5,2,5,3],[192,1990,'m',4,4,2,6,5,4,5,3,4,4,4,3,5,1,6,5,2,6,4,6,5,1,4,6,4,4,1,4,6,2,5,3],[193,1997,'m',1,3,3,6,6,5,6,4,4,5,6,3,6,2,4,4,5,6,6,6,4,2,4,6,1,5,1,4,6,2,2,6],[194,1981,'m',4,3,3,1,6,5,5,1,6,4,4,5,6,3,4,4,4,5,3,6,6,4,6,6,5,5,2,4,4,6,5,6],[195,1980,'m',2,5,2,2,5,5,4,2,4,3,5,6,5,1,4,6,5,5,5,4,5,3,4,5,1,2,2,2,5,5,4,5],[196,1988,'m',1,4,4,6,4,4,5,2,6,3,5,5,5,5,4,2,2,5,4,6,6,4,6,3,4,4,4,6,6,1,2,6],[197,1987,'m',4,4,3,4,5,5,4,3,6,5,4,6,5,5,5,5,6,5,6,4,4,4,5,5,4,5,5,4,5,3,5,5],[198,1986,'g',6,1,2,2,4,5,2,1,5,5,2,6,6,4,4,5,2,6,6,6,4,2,5,5,1,6,2,5,5,5,2,6],[199,1994,'m',5,5,5,3,6,5,2,2,5,5,5,2,5,5,2,5,1,6,5,5,2,1,2,5,2,5,5,4,5,4,5,6],[200,1988,'m',1,1,2,4,4,4,4,2,4,6,4,6,5,4,3,4,3,4,4,4,3,3,5,4,4,5,3,5,4,5,4,4],[201,1991,'m',2,5,5,4,5,5,4,2,5,3,5,4,5,6,5,4,3,5,5,3,3,4,4,6,2,5,4,4,5,5,4,6],[202,1992,'m',2,4,2,3,3,4,4,2,5,5,4,4,5,5,4,3,3,5,4,5,4,3,5,5,3,4,5,3,5,3,5,5],[203,1984,'m',1,1,2,4,5,6,3,2,5,6,2,3,5,2,2,3,2,4,6,4,3,2,5,5,5,5,6,2,2,4,5,5],[204,1989,'m',2,3,4,5,2,4,5,3,5,2,4,4,5,4,3,2,5,5,4,4,4,4,4,6,2,5,5,5,5,3,4,4],[208,1997,'m',4,4,6,3,5,4,6,3,6,2,6,6,6,4,4,5,4,4,6,3,6,4,4,6,3,5,4,2,5,3,4,6],[209,0000,'x',6,4,5,5,5,5,4,2,5,4,4,5,5,4,6,4,3,5,5,3,5,2,5,4,2,5,5,5,4,6,2,5],[210,1995,'m',4,4,3,4,5,4,5,2,4,4,4,3,4,5,6,3,3,4,4,3,5,3,3,4,6,5,4,3,5,3,3,4],[211,1975,'m',2,1,5,2,1,5,4,2,5,2,5,5,5,4,5,4,1,3,3,6,6,2,3,6,2,5,4,2,6,1,3,5],[212,1990,'a',3,5,6,5,4,6,6,2,4,5,5,2,6,5,6,6,3,6,6,6,5,2,4,6,2,4,3,5,6,1,6,6],[213,1993,'g',1,3,6,6,6,2,5,3,6,5,5,6,6,1,6,4,2,6,6,6,3,2,5,6,3,5,6,2,6,2,4,2],[214,1992,'g',2,4,4,2,5,3,3,4,6,4,5,5,6,4,6,2,2,5,4,6,5,5,5,6,6,6,5,4,5,5,3,6],[215,1992,'m',1,4,3,4,4,4,4,4,4,4,5,5,5,6,6,5,4,5,6,3,2,3,2,4,4,4,6,5,5,5,5,6],[216,1992,'m',4,4,4,4,4,5,6,2,5,6,5,5,5,5,5,4,4,5,5,2,4,4,3,3,4,5,5,3,5,2,6,4],[217,1981,'f',4,5,3,4,4,5,4,5,5,4,4,5,6,4,5,6,3,5,3,5,5,4,3,4,5,5,4,3,6,5,4,6],[218,1993,'m',5,4,2,6,6,5,5,4,6,4,5,5,6,2,3,5,4,5,5,6,3,4,4,6,1,6,5,3,6,4,3,6],[219,1996,'f',6,2,5,6,4,4,6,5,6,5,4,6,6,4,4,4,5,5,5,6,5,5,4,6,3,6,5,4,5,4,5,6],[220,1996,'m',5,4,4,3,6,5,3,3,6,3,3,5,4,5,3,3,4,5,5,4,4,5,6,5,4,4,6,3,4,6,4,5],[221,1991,'a',2,5,6,5,6,5,6,3,4,3,2,5,5,5,4,4,2,6,6,5,3,4,3,6,1,4,2,6,4,4,3,6],[222,1996,'m',3,3,4,3,5,6,2,2,5,6,5,3,5,5,5,4,1,3,6,3,5,4,3,6,5,4,4,4,2,1,5,4],[223,1984,'m',3,2,6,4,5,6,5,1,6,6,4,2,5,5,6,4,4,5,6,4,4,2,3,6,5,4,6,5,5,1,5,5],[224,1987,'x',3,4,5,2,4,5,6,4,5,5,4,5,5,5,5,6,2,6,4,4,5,5,4,6,1,5,5,5,5,3,4,6],[225,1990,'m',1,5,2,5,6,2,6,3,4,4,6,6,6,1,6,3,3,6,4,5,5,5,1,6,4,3,6,4,6,4,5,6],[226,1994,'m',2,5,4,3,6,3,6,3,6,3,4,6,4,2,5,1,5,4,3,6,4,4,3,1,4,2,4,2,4,5,3,4],[227,0000,'x',4,2,4,3,5,4,6,5,5,4,5,5,4,6,4,2,3,6,6,5,5,5,4,5,4,5,5,3,5,2,3,5],[228,1991,'m',4,3,5,5,5,5,5,3,5,4,5,4,5,6,4,3,5,6,5,6,4,4,5,4,3,4,5,4,6,4,5,6],[229,1992,'f',5,4,5,4,3,4,6,4,6,4,4,5,6,6,5,5,2,6,5,6,5,2,2,6,2,5,6,4,5,2,4,6],[230,1998,'m',2,4,5,4,6,6,5,1,5,6,3,6,5,2,6,5,2,5,6,5,4,4,2,4,3,5,2,5,3,2,6,4],[231,1993,'m',4,4,5,4,5,5,3,4,5,5,4,5,6,3,5,6,4,5,5,5,4,2,1,6,3,5,3,2,5,2,5,5],[232,1988,'m',4,2,4,3,2,4,5,1,6,5,3,5,5,4,3,3,1,6,5,4,5,3,2,6,4,5,4,4,1,3,2,5],[233,1995,'m',4,4,6,4,4,4,6,2,5,3,4,3,6,5,5,4,2,6,6,5,3,4,3,6,2,4,4,5,5,3,6,5],[234,1996,'m',4,2,4,2,5,3,4,1,5,2,6,4,5,2,2,6,3,6,5,6,4,4,4,6,3,6,2,3,5,3,2,6],[235,1990,'m',5,4,3,3,2,5,3,2,5,5,4,5,4,4,4,5,2,5,5,4,3,1,4,5,4,4,2,5,6,4,4,4],[236,1995,'m',2,3,4,3,4,2,6,3,5,4,4,5,6,2,4,5,4,5,5,5,3,5,2,5,3,5,5,5,5,4,5,6],[237,1996,'m',2,3,4,3,3,5,6,2,4,2,3,5,6,3,5,6,2,4,4,5,4,3,2,6,5,3,3,3,6,4,5,5],[238,1992,'f',4,3,6,4,2,4,6,2,6,3,4,4,5,4,5,4,2,6,5,5,4,4,2,6,1,6,4,2,5,3,3,6],[239,,'',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[240,1980,'m',5,2,5,6,2,6,5,1,6,6,5,5,2,6,4,6,1,6,6,5,4,4,1,3,4,5,6,5,6,1,5,5],[241,1990,'m',1,4,4,6,6,5,6,6,6,4,4,5,4,6,6,6,5,6,6,6,4,1,5,6,5,5,6,3,6,4,6,3],[242,1983,'m',5,3,1,2,4,3,5,3,4,6,4,5,4,4,1,5,3,4,5,2,4,2,5,3,4,4,5,5,3,4,2,4],[243,1990,'m',5,1,2,5,4,4,2,5,6,4,4,5,5,4,4,5,3,5,2,5,5,5,5,6,2,6,5,6,3,4,3,4],[244,1990,'m',6,4,6,4,5,6,6,3,6,3,4,3,6,2,5,4,4,6,6,5,3,4,2,6,3,6,4,5,5,2,4,6],[245,,'',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[246,1991,'m',5,4,4,4,4,5,3,2,5,3,4,6,5,6,5,3,2,5,5,4,4,5,5,5,6,6,4,3,4,2,5,4],[247,0000,'x',1,2,2,4,4,3,5,1,4,3,3,5,4,4,5,4,4,5,3,6,5,3,2,3,3,5,5,4,6,5,5,3],[248,1983,'m',2,3,4,4,5,4,4,2,5,3,4,5,5,2,5,6,2,4,3,5,5,4,4,5,2,4,2,3,4,5,4,3],[249,1995,'m',3,4,3,5,5,5,4,4,3,4,4,5,5,5,5,3,4,4,5,3,4,5,3,5,5,5,5,4,4,4,4,5],[250,1988,'m',5,4,4,3,4,5,4,3,5,5,5,4,5,5,4,4,5,6,5,6,4,2,4,6,2,5,5,5,5,2,5,6],[251,1990,'m',6,4,6,6,4,5,5,2,6,5,5,5,5,5,4,4,3,6,6,6,2,2,6,6,2,6,5,6,6,5,4,6],[252,1995,'m',4,4,2,4,6,5,5,4,5,5,3,5,5,4,5,1,3,5,6,2,5,3,4,5,6,5,5,5,5,5,3,6],[253,1960,'m',1,2,4,5,5,5,5,2,5,5,5,3,5,5,4,4,2,5,4,5,5,2,1,5,5,5,6,5,4,5,6,4],[254,1992,'m',6,4,4,3,4,4,5,4,5,6,3,5,5,6,5,5,5,5,5,4,5,3,5,4,2,6,4,4,5,4,6,5],[255,1992,'m',4,3,5,2,4,4,4,2,2,4,2,5,5,5,3,3,3,5,4,5,4,4,2,4,3,2,5,4,4,3,4,5],[256,1989,'m',3,4,2,4,6,4,3,2,5,6,5,5,5,4,3,4,4,5,5,5,3,4,5,5,3,5,2,5,6,2,2,5],[257,,'',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[258,1991,'g',5,5,5,2,2,3,2,4,2,3,4,5,3,4,4,4,5,5,5,4,3,4,5,4,4,2,2,2,3,3,5,2],[259,,'',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[260,1983,'m',2,6,2,5,6,4,1,5,4,4,6,6,4,4,4,5,5,5,4,5,5,4,3,4,3,3,5,6,6,6,2,5],[261,1994,'m',6,6,6,6,6,5,6,2,6,6,6,6,5,5,5,6,3,3,4,6,6,3,4,6,5,4,6,2,6,1,3,4],[262,1992,'m',5,4,3,4,4,4,4,4,5,3,5,5,5,4,4,4,3,5,4,6,5,4,4,5,5,3,5,3,5,4,5,5],[263,1968,'m',6,3,4,6,5,5,5,3,5,3,5,4,5,5,5,5,4,5,4,5,5,4,5,6,5,5,4,4,5,5,3,5],[264,1991,'m',3,4,3,4,6,5,4,4,5,4,4,4,3,4,2,4,3,5,3,3,3,4,3,3,4,3,3,4,4,4,4,5]]

